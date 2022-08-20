import 'dart:convert';

import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:webview_flutter_plus/webview_flutter_plus.dart';
import 'package:flutter_inappwebview/flutter_inappwebview.dart';
import 'package:flutter_statusbarcolor_ns/flutter_statusbarcolor_ns.dart';

void main() {
  WidgetsFlutterBinding.ensureInitialized();
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Recursive',
      theme: ThemeData(
        primarySwatch: Colors.blue,
      ),
      home: const MyHomePage(title: 'main'),
    );
  }
}

class MyHomePage extends StatefulWidget {
  const MyHomePage({Key? key, required this.title}) : super(key: key);

  final String title;

  @override
  State<MyHomePage> createState() => _MyHomePageState();
}

var webController;

class _MyHomePageState extends State<MyHomePage> {
  late WebViewPlusController _controller;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      resizeToAvoidBottomInset: false,
      body: SafeArea(
        bottom: false,
        child: InAppWebView(
          onWebViewCreated: (controller) {
            controller.loadFile(assetFilePath: "assets/localWeb/index.html");
            changeStatusColor(Colors.black);
            changeNavigationColor(Colors.black);
          },
        ),
      ),
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
