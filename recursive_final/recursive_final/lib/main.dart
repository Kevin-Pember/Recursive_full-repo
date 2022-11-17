import 'dart:io';

import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_inappwebview/flutter_inappwebview.dart';
import 'package:flutter_statusbarcolor_ns/flutter_statusbarcolor_ns.dart';

final InAppLocalhostServer localhostServer = new InAppLocalhostServer();

InAppWebViewGroupOptions options = InAppWebViewGroupOptions(
    android: AndroidInAppWebViewOptions(
      useHybridComposition: true,
    ),
  );
Future main() async {
  WidgetsFlutterBinding.ensureInitialized();

  // start the localhost server
  await localhostServer.start();

  if (Platform.isAndroid) {
    await AndroidInAppWebViewController.setWebContentsDebuggingEnabled(true);
  }

  runApp(MaterialApp(home: MyApp()));
}

class MyApp extends StatefulWidget {
  @override
  _MyAppState createState() => new _MyAppState();
}

class _MyAppState extends State<MyApp> {
  @override
  Widget build(BuildContext context) {
    changeStatusColor(Colors.amber);
    changeNavigationColor(Color.fromARGB(255, 49, 49, 49));
    
    
    return Scaffold(
      resizeToAvoidBottomInset: false,
      body: SafeArea(
          child: Column(children: <Widget>[
        Expanded(
          child: InAppWebView(
            initialUrlRequest: URLRequest(
                url: Uri.parse(
                    "http://localhost:8080/assets/localWeb/index.html")),
            onWebViewCreated: (controller) {},
            onLoadStart: (controller, url) {},
            onLoadStop: (controller, url) {},
            initialOptions: options,
          ),
        )
      ])),
    );
  }
}

changeStatusColor(Color color) async {
  try {
    await FlutterStatusbarcolor.setStatusBarColor(color, animate: true);
  } on PlatformException catch (e) {
    debugPrint(e.toString());
  }
}

changeNavigationColor(Color color) async {
  try {
    await FlutterStatusbarcolor.setNavigationBarColor(color, animate: true);
  } on PlatformException catch (e) {
    debugPrint(e.toString());
  }
}
