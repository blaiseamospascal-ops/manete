package app.manete.priere;

import android.app.PendingIntent;
import android.appwidget.AppWidgetManager;
import android.appwidget.AppWidgetProvider;
import android.content.ComponentName;
import android.content.Context;
import android.content.Intent;
import android.net.Uri;
import android.widget.RemoteViews;

import org.json.JSONObject;

/** Widget « Mon saint patron » : son nom, son invocation et sa fête. Toucher ouvre sa prière. */
public class SaintWidget extends AppWidgetProvider {

    @Override
    public void onUpdate(Context context, AppWidgetManager manager, int[] ids) {
        for (int id : ids) {
            update(context, manager, id);
        }
    }

    static void refreshAll(Context context) {
        try {
            AppWidgetManager manager = AppWidgetManager.getInstance(context);
            for (int id : manager.getAppWidgetIds(new ComponentName(context, SaintWidget.class))) {
                update(context, manager, id);
            }
        } catch (Exception ignored) {
        }
    }

    static void update(Context context, AppWidgetManager manager, int id) {
        JSONObject s = WidgetPrefs.read(context, "saint");
        String name = s == null ? "" : s.optString("n", "");
        RemoteViews views = new RemoteViews(context.getPackageName(), R.layout.saint_widget);
        if (name.isEmpty()) {
            views.setTextViewText(R.id.saint_name, "Mon saint patron");
            views.setTextViewText(R.id.saint_inv, "Choisis ton saint patron dans Manete, Réglages.");
            views.setTextViewText(R.id.saint_feast, "");
        } else {
            views.setTextViewText(R.id.saint_name, name);
            views.setTextViewText(R.id.saint_inv, "« " + s.optString("inv", name + ", priez pour nous.") + " »");
            views.setTextViewText(R.id.saint_feast, s.optString("fete", ""));
        }
        Intent open = new Intent(Intent.ACTION_VIEW, Uri.parse(name.isEmpty() ? "manete://reglages" : "manete://saint"));
        open.setPackage(context.getPackageName());
        views.setOnClickPendingIntent(R.id.saint_root, PendingIntent.getActivity(context, 21, open, PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE));
        manager.updateAppWidget(id, views);
    }
}
