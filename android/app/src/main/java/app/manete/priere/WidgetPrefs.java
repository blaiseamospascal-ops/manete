package app.manete.priere;

import android.content.Context;
import android.content.SharedPreferences;

import org.json.JSONObject;

/** Lecture et écriture des données partagées entre l'app (plugin Preferences) et les widgets. */
final class WidgetPrefs {
    private WidgetPrefs() {}

    static SharedPreferences prefs(Context c) {
        return c.getSharedPreferences("CapacitorStorage", Context.MODE_PRIVATE);
    }

    static JSONObject read(Context c, String key) {
        try {
            String raw = prefs(c).getString(key, null);
            return raw == null ? null : new JSONObject(raw);
        } catch (Exception e) {
            return null;
        }
    }

    static void write(Context c, String key, JSONObject o) {
        prefs(c).edit().putString(key, o.toString()).apply();
    }
}
