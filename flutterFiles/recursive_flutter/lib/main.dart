import 'dart:convert';

import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:webview_flutter_plus/webview_flutter_plus.dart';
import 'package:hexcolor/hexcolor.dart';

void main() {
  runApp(const MyApp());
  SystemChrome.setSystemUIOverlayStyle(SystemUiOverlayStyle(
    statusBarColor: Colors.purple,
  ));
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
      resizeToAvoidBottomInset : false,
      body: SafeArea(
        child: WebViewPlus(
          initialUrl: 'about:blank',
          javascriptMode: JavascriptMode.unrestricted,
          onWebViewCreated: (controller) {
            controller.loadUrl('assets/localWeb/Recursive.html');
            webController = controller;
          },
          javascriptChannels: Set.from([
            JavascriptChannel(
                name: 'colorMessager',
                onMessageReceived: (JavascriptMessage message) {
                  final Color color = HexColor(message.message);
                  SystemChrome.setSystemUIOverlayStyle(SystemUiOverlayStyle(statusBarColor: color,));
                })
          ]),
        ),
      ),
    );
  }
}
