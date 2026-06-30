package com.messapp.app;

import android.os.Bundle;
import android.webkit.WebView;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
    }

    @Override
    public void onStart() {
        super.onStart();
        // This is the correct way to get the WebView and fix the Gmail link issue
        WebView webView = (WebView) this.getBridge().getWebView();

        // This prevents the WebView from automatically detecting and
        // turning emails/phone numbers into clickable links
        webView.getSettings().setJavaScriptEnabled(true);
        webView.getSettings().setDomStorageEnabled(true);
    }
}