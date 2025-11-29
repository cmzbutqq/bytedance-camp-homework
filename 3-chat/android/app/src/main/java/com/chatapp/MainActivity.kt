package com.chatapp

import android.Manifest
import android.content.pm.PackageManager
import android.os.Build
import android.os.Bundle
import android.webkit.JavascriptInterface
import android.webkit.WebChromeClient
import android.webkit.WebView
import android.webkit.WebViewClient
import android.widget.Toast
import androidx.activity.result.contract.ActivityResultContracts
import androidx.appcompat.app.AppCompatActivity
import androidx.core.content.ContextCompat
import org.json.JSONObject

class MainActivity : AppCompatActivity() {

    private lateinit var webView: WebView
    private val requestPermissionLauncher = registerForActivityResult(
        ActivityResultContracts.RequestMultiplePermissions()
    ) { permissions ->
        val granted = permissions.all { it.value }
        if (granted) {
            Toast.makeText(this, "权限已授予", Toast.LENGTH_SHORT).show()
        } else {
            Toast.makeText(this, "需要权限才能使用完整功能", Toast.LENGTH_SHORT).show()
        }
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        setupWebView()
        requestPermissions()
    }

    private fun setupWebView() {
        webView = findViewById(R.id.webView)
        
        // 启用 JavaScript
        webView.settings.apply {
            javaScriptEnabled = true
            domStorageEnabled = true
            allowFileAccess = true
            allowContentAccess = true
            setSupportZoom(true)
            builtInZoomControls = false
            displayZoomControls = false
        }

        // 设置 WebViewClient
        webView.webViewClient = object : WebViewClient() {
            override fun shouldOverrideUrlLoading(view: WebView?, url: String?): Boolean {
                return false
            }
        }

        // 设置 WebChromeClient（用于权限请求）
        webView.webChromeClient = object : WebChromeClient() {
            override fun onPermissionRequest(request: android.webkit.PermissionRequest?) {
                request?.grant(request?.resources)
            }
        }

        // 添加 JavaScript 接口
        webView.addJavascriptInterface(WebAppInterface(), "AndroidBridge")

        // 加载前端页面
        // 这里简化处理：统一使用开发环境地址
        // - 模拟器：10.0.2.2 指向宿主机的 localhost
        // - 真机：请将下面的地址改为电脑的局域网 IP，例如 http://192.168.1.100:5173
        val url = "http://10.0.2.2:5173"

        webView.loadUrl(url)
    }

    private fun requestPermissions() {
        val permissions = mutableListOf<String>().apply {
            add(Manifest.permission.INTERNET)
            add(Manifest.permission.ACCESS_NETWORK_STATE)
            
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
                // Android 13+ 使用新的权限
                add(Manifest.permission.READ_MEDIA_AUDIO)
                add(Manifest.permission.READ_MEDIA_VIDEO)
            } else {
                add(Manifest.permission.READ_EXTERNAL_STORAGE)
                if (Build.VERSION.SDK_INT <= Build.VERSION_CODES.P) {
                    add(Manifest.permission.WRITE_EXTERNAL_STORAGE)
                }
            }
            
            add(Manifest.permission.RECORD_AUDIO)
            add(Manifest.permission.CAMERA)
        }

        val permissionsToRequest = permissions.filter {
            ContextCompat.checkSelfPermission(this, it) != PackageManager.PERMISSION_GRANTED
        }

        if (permissionsToRequest.isNotEmpty()) {
            requestPermissionLauncher.launch(permissionsToRequest.toTypedArray())
        }
    }

    override fun onBackPressed() {
        if (webView.canGoBack()) {
            webView.goBack()
        } else {
            super.onBackPressed()
        }
    }

    /**
     * JavaScript 接口类
     * 暴露原生方法给 WebView 调用
     */
    inner class WebAppInterface {
        
        /**
         * 获取设备信息
         */
        @JavascriptInterface
        fun getDeviceInfo(): String {
            val deviceInfo = JSONObject().apply {
                put("manufacturer", Build.MANUFACTURER)
                put("model", Build.MODEL)
                put("sdkVersion", Build.VERSION.SDK_INT)
                put("release", Build.VERSION.RELEASE)
                put("brand", Build.BRAND)
                put("device", Build.DEVICE)
            }
            return deviceInfo.toString()
        }

        /**
         * 请求麦克风权限
         */
        @JavascriptInterface
        fun requestMicrophonePermission(): Boolean {
            return if (ContextCompat.checkSelfPermission(
                    this@MainActivity,
                    Manifest.permission.RECORD_AUDIO
                ) == PackageManager.PERMISSION_GRANTED
            ) {
                true
            } else {
                runOnUiThread {
                    requestPermissionLauncher.launch(arrayOf(Manifest.permission.RECORD_AUDIO))
                }
                false
            }
        }

        /**
         * 请求相机权限
         */
        @JavascriptInterface
        fun requestCameraPermission(): Boolean {
            return if (ContextCompat.checkSelfPermission(
                    this@MainActivity,
                    Manifest.permission.CAMERA
                ) == PackageManager.PERMISSION_GRANTED
            ) {
                true
            } else {
                runOnUiThread {
                    requestPermissionLauncher.launch(arrayOf(Manifest.permission.CAMERA))
                }
                false
            }
        }

        /**
         * 显示 Toast 消息
         */
        @JavascriptInterface
        fun showToast(message: String) {
            runOnUiThread {
                Toast.makeText(this@MainActivity, message, Toast.LENGTH_SHORT).show()
            }
        }

        /**
         * 发送 App 推送通知（简化版）
         */
        @JavascriptInterface
        fun sendNotification(title: String, message: String) {
            runOnUiThread {
                // 这里可以集成实际的推送服务（如 FCM）
                // 目前使用 Toast 作为简化实现
                Toast.makeText(
                    this@MainActivity,
                    "$title: $message",
                    Toast.LENGTH_LONG
                ).show()
            }
        }
    }
}
