package app.manete.priere;

import android.Manifest;
import android.database.Cursor;
import android.provider.ContactsContract;

import com.getcapacitor.JSArray;
import com.getcapacitor.JSObject;
import com.getcapacitor.PermissionState;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;
import com.getcapacitor.annotation.Permission;
import com.getcapacitor.annotation.PermissionCallback;

import java.util.HashSet;
import java.util.Set;

/**
 * Lit seulement le prénom et le nom affiché des contacts, sur le téléphone,
 * pour signaler les fêtes du jour. Rien n'est enregistré ni envoyé.
 * Lecture seule : l'app ne demande jamais le droit de modifier les contacts.
 */
@CapacitorPlugin(name = "Prenoms", permissions = { @Permission(strings = { Manifest.permission.READ_CONTACTS }, alias = "contacts") })
public class PrenomsPlugin extends Plugin {

    @PluginMethod
    public void lire(PluginCall call) {
        if (getPermissionState("contacts") != PermissionState.GRANTED) {
            if (call.getBoolean("demander", false)) {
                requestPermissionForAlias("contacts", call, "apresPermission");
            } else {
                JSObject r = new JSObject();
                r.put("autorise", false);
                r.put("contacts", new JSArray());
                call.resolve(r);
            }
            return;
        }
        call.resolve(lireContacts());
    }

    @PermissionCallback
    private void apresPermission(PluginCall call) {
        if (getPermissionState("contacts") == PermissionState.GRANTED) {
            call.resolve(lireContacts());
        } else {
            JSObject r = new JSObject();
            r.put("autorise", false);
            r.put("contacts", new JSArray());
            call.resolve(r);
        }
    }

    private JSObject lireContacts() {
        JSArray list = new JSArray();
        Set<String> seen = new HashSet<>();
        String[] cols = {
            ContactsContract.CommonDataKinds.StructuredName.GIVEN_NAME,
            ContactsContract.CommonDataKinds.StructuredName.DISPLAY_NAME
        };
        try (Cursor c = getContext().getContentResolver().query(
                ContactsContract.Data.CONTENT_URI, cols,
                ContactsContract.Data.MIMETYPE + "=?",
                new String[] { ContactsContract.CommonDataKinds.StructuredName.CONTENT_ITEM_TYPE }, null)) {
            if (c != null) {
                while (c.moveToNext()) {
                    String given = c.getString(0);
                    String display = c.getString(1);
                    if (given == null || given.trim().isEmpty()) {
                        continue;
                    }
                    String key = given.trim() + "|" + (display == null ? "" : display.trim());
                    if (seen.add(key)) {
                        JSObject o = new JSObject();
                        o.put("prenom", given.trim());
                        o.put("nom", display == null ? given.trim() : display.trim());
                        list.put(o);
                    }
                }
            }
        } catch (Exception ignored) {
        }
        JSObject r = new JSObject();
        r.put("autorise", true);
        r.put("contacts", list);
        return r;
    }
}
