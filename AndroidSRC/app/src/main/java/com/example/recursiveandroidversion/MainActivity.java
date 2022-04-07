package com.example.recursiveandroidversion;

import static android.graphics.Color.parseColor;

import android.content.Context;
import android.graphics.Bitmap;
import android.os.Bundle;
import android.util.Log;
import android.view.Window;
import android.webkit.ConsoleMessage;
import android.webkit.JavascriptInterface;
import android.webkit.WebChromeClient;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import androidx.appcompat.app.AppCompatActivity;
import android.graphics.Color;

public class MainActivity extends AppCompatActivity {
    private WebView myWebView;
    /* access modifiers changed from: protected */
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView((int) R.layout.activity_main);
        WebView webView = (WebView) findViewById(R.id.webview);
        this.myWebView = webView;
        webView.setWebViewClient(new WebViewClient());
        this.myWebView.loadUrl("file:///android_asset/localWeb/Recursive.html");
        WebSettings websettings = this.myWebView.getSettings();
        websettings.setJavaScriptEnabled(true);
        websettings.setDomStorageEnabled(true);
        myWebView.setVerticalScrollBarEnabled(false);
        myWebView.setHorizontalScrollBarEnabled(false);
        myWebView.setWebChromeClient(new WebChromeClient() {
            @Override
            public boolean onConsoleMessage(ConsoleMessage consoleMessage) {
                Log.d("MyApplication", consoleMessage.message() + " -- From line " +
                        consoleMessage.lineNumber() + " of " + consoleMessage.sourceId());
                return true;
            }
        });
        webView.addJavascriptInterface(new WebAppInterface(this), "Android");

    }

    public class mywebClient extends WebViewClient {
        public mywebClient() {
        }

        public void onPageStarted(WebView view, String url, Bitmap favicon) {
            super.onPageStarted(view, url, favicon);
        }

        public boolean shouldOverrideUrlLoading(WebView view, String url) {
            view.loadUrl(url);
            return true;
        }
    }
    public class WebAppInterface {
        Context mContext;


        WebAppInterface(Context c) {
            mContext = c;
        }


        @JavascriptInterface
        public void setStatusColor(String color) {
            Window window = getWindow();
            window.setStatusBarColor(parseColor(color));
        }
    }

    public void onBackPressed() {
        myWebView.evaluateJavascript("universalBack();", null);
    }
}