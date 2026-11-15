package app.manete.priere;

import android.os.Bundle;

import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {

    @Override
    public void onCreate(Bundle savedInstanceState) {
        registerPlugin(BarsPlugin.class);
        super.onCreate(savedInstanceState);
    }

    /** Quand l'app passe en arrière-plan, le widget reprend la neuvaine en cours et la série de jours. */
    @Override
    public void onPause() {
        super.onPause();
        PrayerWidget.refreshAll(this);
        RosaryWidget.refreshAll(this);
        SaintWidget.refreshAll(this);
    }
}
