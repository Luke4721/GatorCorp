package com.gatorcorp.seating;

import android.os.Bundle;
import androidx.core.view.WindowCompat;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        // Let the WebView draw edge-to-edge, behind the (now transparent)
        // status bar, instead of Android reserving a solid-color gap for
        // it above the content on every page.
        WindowCompat.setDecorFitsSystemWindows(getWindow(), false);
    }
}
