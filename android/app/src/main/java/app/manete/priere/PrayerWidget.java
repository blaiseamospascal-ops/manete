package app.manete.priere;

import android.app.AlarmManager;
import android.app.PendingIntent;
import android.appwidget.AppWidgetManager;
import android.appwidget.AppWidgetProvider;
import android.content.ComponentName;
import android.content.Context;
import android.content.Intent;
import android.net.Uri;
import android.view.View;
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
 * La neuvaine en cours et la série de jours viennent de l'app (plugin Preferences, clé « widget »).
 */
public class PrayerWidget extends AppWidgetProvider {

    @Override
    public void onUpdate(Context context, AppWidgetManager manager, int[] ids) {
        for (int id : ids) {
            update(context, manager, id);
        }
        scheduleMidnight(context);
    }

    @Override
    public void onReceive(Context context, Intent intent) {
        super.onReceive(context, intent);
        String a = intent.getAction();
        if (ACTION_MIDNIGHT.equals(a) || Intent.ACTION_TIME_CHANGED.equals(a)
                || Intent.ACTION_TIMEZONE_CHANGED.equals(a) || Intent.ACTION_DATE_CHANGED.equals(a)
                || Intent.ACTION_MY_PACKAGE_REPLACED.equals(a)) {
            refreshAll(context);
            scheduleMidnight(context);
        }
    }

    @Override
    public void onEnabled(Context context) {
        scheduleMidnight(context);
    }

    @Override
    public void onDisabled(Context context) {
        AlarmManager am = (AlarmManager) context.getSystemService(Context.ALARM_SERVICE);
        if (am != null) {
            am.cancel(midnightIntent(context));
        }
    }

    static final String ACTION_MIDNIGHT = "app.manete.priere.WIDGET_MIDNIGHT";

    private static PendingIntent midnightIntent(Context context) {
        Intent i = new Intent(context, PrayerWidget.class);
        i.setAction(ACTION_MIDNIGHT);
        return PendingIntent.getBroadcast(context, 3, i, PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE);
    }

    /**
     * Réveil peu après minuit pour changer de saint et de parole, même si l'app n'est pas ouverte.
     * Alarme non exacte : Android peut la décaler un peu pour économiser la batterie,
     * mais elle part au plus tard quand le téléphone se réveille.
     */
    static void scheduleMidnight(Context context) {
        try {
            AlarmManager am = (AlarmManager) context.getSystemService(Context.ALARM_SERVICE);
            if (am == null) {
                return;
            }
            Calendar next = Calendar.getInstance();
            next.add(Calendar.DAY_OF_YEAR, 1);
            next.set(Calendar.HOUR_OF_DAY, 0);
            next.set(Calendar.MINUTE, 1);
            next.set(Calendar.SECOND, 0);
            next.set(Calendar.MILLISECOND, 0);
            am.setAndAllowWhileIdle(AlarmManager.RTC_WAKEUP, next.getTimeInMillis(), midnightIntent(context));
        } catch (Exception ignored) {
        }
    }

    /** Met à jour tous les widgets posés sur l'écran d'accueil (appelé quand l'app passe en arrière-plan). */
    static void refreshAll(Context context) {
        scheduleMidnight(context);
        try {
            AppWidgetManager manager = AppWidgetManager.getInstance(context);
            int[] ids = manager.getAppWidgetIds(new ComponentName(context, PrayerWidget.class));
            for (int id : ids) {
                update(context, manager, id);
            }
        } catch (Exception ignored) {
        }
    }

    /** Ligne d'état : « Neuvaine · jour 4 sur 9 » et « 5 jours d'affilée ». Vide si rien à montrer. */
    private static String statusLine(Context context, Calendar now) {
        try {
            String raw = context.getSharedPreferences("CapacitorStorage", Context.MODE_PRIVATE).getString("widget", null);
            if (raw == null) {
                return "";
            }
            JSONObject st = new JSONObject(raw);
            StringBuilder sb = new StringBuilder();
            String novena = st.optString("novena", "");
            int day = st.optInt("day", 0);
            if (!novena.isEmpty() && day > 0) {
                sb.append(novena).append(" · jour ").append(day).append(" sur 9");
            }
            int streak = st.optInt("streak", 0);
            String last = st.optString("lastDay", "");
            if (!st.optBoolean("hide", false) && streak > 1 && !last.isEmpty()) {
                SimpleDateFormat f = new SimpleDateFormat("yyyy-MM-dd", Locale.ROOT);
                Calendar y = (Calendar) now.clone();
                y.add(Calendar.DAY_OF_YEAR, -1);
                if (last.equals(f.format(now.getTime())) || last.equals(f.format(y.getTime()))) {
                    if (sb.length() > 0) {
                        sb.append(" · ");
                    }
                    sb.append(streak).append(" jours d'affilée");
                }
            }
            return sb.toString();
        } catch (Exception e) {
            return "";
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
        String status = statusLine(context, now);
        views.setTextViewText(R.id.widget_status, status);
        views.setViewVisibility(R.id.widget_status, status.isEmpty() ? View.GONE : View.VISIBLE);

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
