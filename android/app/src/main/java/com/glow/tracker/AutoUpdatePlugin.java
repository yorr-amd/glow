package com.glow.tracker;

import android.app.DownloadManager;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.net.Uri;
import android.os.Build;
import android.os.Environment;
import android.provider.Settings;
import android.widget.Toast;
import androidx.core.content.FileProvider;
import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;
import java.io.File;

@CapacitorPlugin(name = "AutoUpdate")
public class AutoUpdatePlugin extends Plugin {

    private long activeDownloadId = -1;
    private BroadcastReceiver downloadReceiver = null;

    @PluginMethod
    public void downloadAndInstall(PluginCall call) {
        String url = call.getString("url");
        String version = call.getString("version", "latest");
        String fileName = call.getString("fileName", "Glow-update.apk");

        if (url == null || url.trim().isEmpty()) {
            call.reject("URL download tidak boleh kosong");
            return;
        }

        Context context = getContext();
        if (context == null) {
            call.reject("Context Android tidak tersedia");
            return;
        }

        // Cek izin instalasi di Android 8.0+ (Oreo)
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            if (!context.getPackageManager().canRequestPackageInstalls()) {
                try {
                    Intent manageIntent = new Intent(Settings.ACTION_MANAGE_UNKNOWN_APP_SOURCES);
                    manageIntent.setData(Uri.parse("package:" + context.getPackageName()));
                    manageIntent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
                    context.startActivity(manageIntent);
                    Toast.makeText(context, "Izinkan penginstalan aplikasi dari sumber ini untuk melanjutkan pembaruan", Toast.LENGTH_LONG).show();
                } catch (Exception ignored) {}
            }
        }

        try {
            DownloadManager.Request request = new DownloadManager.Request(Uri.parse(url));
            request.setTitle("Glow Update v" + version);
            request.setDescription("Mengunduh pembaruan aplikasi Glow...");
            request.setMimeType("application/vnd.android.package-archive");
            request.setNotificationVisibility(DownloadManager.Request.VISIBILITY_VISIBLE_NOTIFY_COMPLETED);

            // Simpan di direktori eksternal unduhan aplikasi
            File destinationFile = new File(context.getExternalFilesDir(Environment.DIRECTORY_DOWNLOADS), fileName);
            if (destinationFile.exists()) {
                destinationFile.delete();
            }
            request.setDestinationUri(Uri.fromFile(destinationFile));

            final DownloadManager downloadManager = (DownloadManager) context.getSystemService(Context.DOWNLOAD_SERVICE);
            if (downloadManager == null) {
                call.reject("DownloadManager tidak tersedia pada perangkat");
                return;
            }

            activeDownloadId = downloadManager.enqueue(request);

            // Bersihkan receiver lama jika ada
            if (downloadReceiver != null) {
                try {
                    context.unregisterReceiver(downloadReceiver);
                } catch (Exception ignored) {}
                downloadReceiver = null;
            }

            downloadReceiver = new BroadcastReceiver() {
                @Override
                public void onReceive(Context ctx, Intent intent) {
                    long id = intent.getLongExtra(DownloadManager.EXTRA_DOWNLOAD_ID, -1);
                    if (id == activeDownloadId) {
                        launchApkInstaller(ctx, destinationFile);
                    }
                }
            };

            IntentFilter filter = new IntentFilter(DownloadManager.ACTION_DOWNLOAD_COMPLETE);
            if (Build.VERSION.SDK_INT >= 33) {
                context.registerReceiver(downloadReceiver, filter, Context.RECEIVER_EXPORTED);
            } else {
                context.registerReceiver(downloadReceiver, filter);
            }

            Toast.makeText(context, "Mengunduh Glow v" + version + " di latar belakang...", Toast.LENGTH_SHORT).show();

            JSObject ret = new JSObject();
            ret.put("success", true);
            ret.put("downloadId", activeDownloadId);
            ret.put("message", "Pengunduhan dimulai");
            call.resolve(ret);

        } catch (Exception e) {
            call.reject("Gagal memulai pengunduhan: " + e.getMessage(), e);
        }
    }

    private void launchApkInstaller(Context context, File apkFile) {
        try {
            if (!apkFile.exists()) {
                Toast.makeText(context, "File pembaruan tidak ditemukan", Toast.LENGTH_SHORT).show();
                return;
            }

            Uri apkUri;
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.N) {
                apkUri = FileProvider.getUriForFile(
                    context,
                    context.getPackageName() + ".fileprovider",
                    apkFile
                );
            } else {
                apkUri = Uri.fromFile(apkFile);
            }

            Intent installIntent = new Intent(Intent.ACTION_VIEW);
            installIntent.setDataAndType(apkUri, "application/vnd.android.package-archive");
            installIntent.addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION);
            installIntent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);

            context.startActivity(installIntent);
        } catch (Exception e) {
            Toast.makeText(context, "Gagal membuka installer: " + e.getMessage(), Toast.LENGTH_LONG).show();
        }
    }

    @PluginMethod
    public void canRequestPackageInstalls(PluginCall call) {
        Context context = getContext();
        boolean canInstall = true;
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O && context != null) {
            canInstall = context.getPackageManager().canRequestPackageInstalls();
        }
        JSObject ret = new JSObject();
        ret.put("canInstall", canInstall);
        call.resolve(ret);
    }

    @PluginMethod
    public void openInstallPermissionSettings(PluginCall call) {
        Context context = getContext();
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O && context != null) {
            try {
                Intent intent = new Intent(Settings.ACTION_MANAGE_UNKNOWN_APP_SOURCES);
                intent.setData(Uri.parse("package:" + context.getPackageName()));
                intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
                context.startActivity(intent);
                JSObject ret = new JSObject();
                ret.put("success", true);
                call.resolve(ret);
                return;
            } catch (Exception e) {
                call.reject("Gagal membuka pengaturan: " + e.getMessage());
                return;
            }
        }
        JSObject ret = new JSObject();
        ret.put("success", true);
        call.resolve(ret);
    }
}
