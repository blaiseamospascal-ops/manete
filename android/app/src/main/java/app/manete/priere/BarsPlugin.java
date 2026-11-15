package app.manete.priere;

import android.graphics.Color;
import android.view.Window;

import androidx.core.view.WindowCompat;
import androidx.core.view.WindowInsetsControllerCompat;

import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

/**
 * Donne à la barre d'état (en haut) et à la barre de navigation (en bas)
 * la couleur du fond choisi dans l'app, avec des icônes claires ou sombres.
 */
@CapacitorPlugin(name = "Bars")
public class BarsPlugin extends Plugin {

    @PluginMethod
    public void setColor(final PluginCall call) {
        final String status = call.getString("color", "#0e1a36");
        final String nav = call.getString("nav", status);
        final boolean light = Boolean.TRUE.equals(call.getBoolean("light", false));
        getActivity().runOnUiThread(() -> {
            try {
                Window window = getActivity().getWindow();
                window.setStatusBarColor(Color.parseColor(status));
                window.setNavigationBarColor(Color.parseColor(nav));
                WindowInsetsControllerCompat controller = WindowCompat.getInsetsController(window, window.getDecorView());
                controller.setAppearanceLightStatusBars(light);
                controller.setAppearanceLightNavigationBars(light);
                call.resolve();
            } catch (Exception e) {
                call.reject("Couleur des barres : " + e.getMessage());
            }
        });
    }
}
