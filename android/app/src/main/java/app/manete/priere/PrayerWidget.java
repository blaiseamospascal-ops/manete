package app.manete.priere;

import android.app.PendingIntent;
import android.appwidget.AppWidgetManager;
import android.appwidget.AppWidgetProvider;
import android.content.Context;
import android.content.Intent;
import android.net.Uri;
import android.widget.RemoteViews;

import org.json.JSONArray;
import org.json.JSONObject;

import java.io.ByteArrayOutputStream;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Locale;

/**
 * Widget d'écran d'accueil : date, saint du jour, parole du jour,
 * et un bouton « 1 minute avec Jésus » qui ouvre la prière express.
 * Les données viennent de assets/widget_data.json (généré par scripts/widget-data.mjs) :
 * le widget reste juste même si l'app n'est pas ouverte.
 */
public class PrayerWidget extends AppWidgetProvider {

    @Override
    public void onUpdate(Context context, AppWidgetManager manager, int[] ids) {
        for (int id : ids) {
            update(context, manager, id);
        }
    }

    private static JSONObject loadData(Context context) {
        try (InputStream in = context.getAssets().open("widget_data.json")) {
            ByteArrayOutputStream out = new ByteArrayOutputStream();
            byte[] buf = new byte[8192];
            int n;
            while ((n = in.read(buf)) != -1) {
                out.write(buf, 0, n);
            }
            return new JSONObject(new String(out.toByteArray(), StandardCharsets.UTF_8));
        } catch (Exception e) {
            return null;
        }
    }

    static void update(Context context, AppWidgetManager manager, int id) {
        Calendar now = Calendar.getInstance();
        String key = String.format(Locale.ROOT, "%02d-%02d", now.get(Calendar.MONTH) + 1, now.get(Calendar.DAY_OF_MONTH));
        String date = new SimpleDateFormat("EEEE d MMMM", Locale.FRENCH).format(now.getTime());
        date = date.substring(0, 1).toUpperCase(Locale.FRENCH) + date.substring(1);

        String saint = "";
        String verse = "Demeurez en moi, et je demeurerai en vous.";
        String ref = "Jean 15,4";
        JSONObject data = loadData(context);
        if (data != null) {
            JSONObject saints = data.optJSONObject("saints");
            if (saints != null) {
                saint = saints.optString(key, "");
            }
            JSONArray verses = data.optJSONArray("verses");
            if (verses != null && verses.length() > 0) {
                JSONArray v = verses.optJSONArray(now.get(Calendar.DAY_OF_YEAR) % verses.length());
                if (v != null) {
                    verse = v.optString(0, verse);
                    ref = v.optString(1, ref);
                }
            }
        }

        RemoteViews views = new RemoteViews(context.getPackageName(), R.layout.prayer_widget);
        views.setTextViewText(R.id.widget_date, date);
        views.setTextViewText(R.id.widget_saint, saint);
        views.setTextViewText(R.id.widget_verse, "« " + verse + " »");
        views.setTextViewText(R.id.widget_ref, ref);

        int flags = PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE;

        Intent express = new Intent(Intent.ACTION_VIEW, Uri.parse("manete://express"));
        express.setPackage(context.getPackageName());
        views.setOnClickPendingIntent(R.id.widget_express, PendingIntent.getActivity(context, 1, express, flags));

        Intent open = context.getPackageManager().getLaunchIntentForPackage(context.getPackageName());
        if (open != null) {
            views.setOnClickPendingIntent(R.id.widget_root, PendingIntent.getActivity(context, 2, open, flags));
        }

        manager.updateAppWidget(id, views);
    }
}
