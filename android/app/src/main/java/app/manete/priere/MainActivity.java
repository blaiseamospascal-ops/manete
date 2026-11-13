package app.manete.priere;

import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {

    /** Quand l'app passe en arrière-plan, le widget reprend la neuvaine en cours et la série de jours. */
    @Override
    public void onPause() {
        super.onPause();
        PrayerWidget.refreshAll(this);
    }
}
