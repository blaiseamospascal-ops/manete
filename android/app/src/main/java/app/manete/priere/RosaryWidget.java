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

/**
 * Widget « Mon chapelet » : garde la place dans le chapelet (dizaine et grain).
 * Les boutons + et − avancent ou reculent d'un grain sans ouvrir l'app ;
 * « Reprendre » ouvre la prière à cet endroit. L'app et le widget partagent la clé « chapelet ».
 */
public class RosaryWidget extends AppWidgetProvider {

    static final String ACTION_PLUS = "app.manete.priere.ROSARY_PLUS";
    static final String ACTION_MINUS = "app.manete.priere.ROSARY_MINUS";
    static final String ACTION_RESET = "app.manete.priere.ROSARY_RESET";

    @Override
    public void onUpdate(Context context, AppWidgetManager manager, int[] ids) {
        for (int id : ids) {
            update(context, manager, id);
        }
    }

    @Override
    public void onReceive(Context context, Intent intent) {
        super.onReceive(context, intent);
        String a = intent.getAction();
        if (ACTION_PLUS.equals(a) || ACTION_MINUS.equals(a) || ACTION_RESET.equals(a)) {
            JSONObject st = state(context);
            try {
                int total = st.optInt("total", 5);
                int d = st.optInt("d", 0);
                int b = st.optInt("b", 0);
                if (ACTION_RESET.equals(a)) {
                    d = 0;
                    b = 0;
                } else if (ACTION_PLUS.equals(a)) {
                    if (d < total) {
                        b++;
                        if (b > 10) {
                            b = 0;
                            d++;
                        }
                    }
                } else {
                    if (d >= total) {
                        d = total - 1;
                        b = 10;
                    } else if (b > 0) {
                        b--;
                    } else if (d > 0) {
                        d--;
                        b = 10;
                    }
                }
                st.put("d", d);
                st.put("b", b);
                st.put("src", "widget");
                st.put("ts", System.currentTimeMillis());
                WidgetPrefs.write(context, "chapelet", st);
            } catch (Exception ignored) {
            }
            refreshAll(context);
        }
    }

    static JSONObject state(Context context) {
        JSONObject st = WidgetPrefs.read(context, "chapelet");
        if (st == null) {
            st = new JSONObject();
            try {
                st.put("setName", "Chapelet");
                st.put("total", 5);
                st.put("d", 0);
                st.put("b", 0);
            } catch (Exception ignored) {
            }
        }
        return st;
    }

    static void refreshAll(Context context) {
        try {
            AppWidgetManager manager = AppWidgetManager.getInstance(context);
            for (int id : manager.getAppWidgetIds(new ComponentName(context, RosaryWidget.class))) {
                update(context, manager, id);
            }
        } catch (Exception ignored) {
        }
    }

    private static String ordinal(int n) {
        return n == 1 ? "1re" : n + "e";
    }

    private static PendingIntent action(Context context, String action, int code) {
        Intent i = new Intent(context, RosaryWidget.class);
        i.setAction(action);
        return PendingIntent.getBroadcast(context, code, i, PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE);
    }

    static void update(Context context, AppWidgetManager manager, int id) {
        JSONObject st = state(context);
        int total = st.optInt("total", 5);
        int d = st.optInt("d", 0);
        int b = st.optInt("b", 0);
        String setName = st.optString("setName", "Chapelet");

        String where;
        String beads;
        if (d >= total) {
            where = "Chapelet terminé. Merci !";
            beads = "✚  ● ● ● ● ● ● ● ● ● ●";
        } else {
            String mystere = "";
            org.json.JSONArray names = st.optJSONArray("mysteres");
            if (names != null && d < names.length()) {
                mystere = " · " + names.optString(d, "");
            }
            where = ordinal(d + 1) + " dizaine" + (b == 0 ? " · Notre Père" : " · " + b + " / 10") + mystere;
            StringBuilder sb = new StringBuilder(b == 0 ? "✚ " : "✝ ");
            for (int k = 1; k <= 10; k++) {
                sb.append(' ').append(k <= b ? '●' : '○');
            }
            beads = sb.toString();
        }

        RemoteViews views = new RemoteViews(context.getPackageName(), R.layout.rosary_widget);
        views.setTextViewText(R.id.rosary_title, setName);
        views.setTextViewText(R.id.rosary_where, where);
        views.setTextViewText(R.id.rosary_beads, beads);
        views.setContentDescription(R.id.rosary_beads, d >= total ? "Chapelet terminé" : b + " grains sur 10");

        views.setOnClickPendingIntent(R.id.rosary_plus, action(context, d >= total ? ACTION_RESET : ACTION_PLUS, 11));
        views.setTextViewText(R.id.rosary_plus, d >= total ? "Recommencer" : "+ 1 grain");
        views.setOnClickPendingIntent(R.id.rosary_minus, action(context, ACTION_MINUS, 12));

        Intent open = new Intent(Intent.ACTION_VIEW, Uri.parse("manete://chapelet-widget"));
        open.setPackage(context.getPackageName());
        views.setOnClickPendingIntent(R.id.rosary_open, PendingIntent.getActivity(context, 13, open, PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE));

        manager.updateAppWidget(id, views);
    }
}
