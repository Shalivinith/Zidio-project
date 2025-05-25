import 'dart:async';
import 'package:leavetracker1/database/database.dart';
import 'package:sqflite/sqflite.dart';
import 'package:path/path.dart';
import 'package:shared_preferences/shared_preferences.dart';

class Credentials {
  final Help helper = Help();
  Database? _database;

  Future<Database?> get dte async {
    if (_database != null) {
      return _database;
    } else {
      _database = await helper.initializeDatabase();
      
      // Debugging: Check if the table exists
      List<String> tables = await getTables(_database!);
      print('Tables in the database: $tables'); // This will print the list of tables
      
      return _database;
    }
  }

  Future<bool> checkCredentials(String mail, String password) async {
    try {
      var db = await dte;
      List<Map<String, dynamic>> result = await db!.query(
        'credentials',
        where: 'email = ? AND password = ?',
        whereArgs: [mail, password],
      );

      // Debug print
      print('Query result: $result');
      return result.isNotEmpty;
    } catch (e) {
      print('Error checking credentials: $e');
      return false; 
    }
  }

  Future<void> saveLoginStatus(bool isLoggedIn) async {
    SharedPreferences prefs = await SharedPreferences.getInstance();
    await prefs.setBool('isLoggedIn', isLoggedIn);
  }

  Future<bool> isLoggedIn() async {
    SharedPreferences prefs = await SharedPreferences.getInstance();
    return prefs.getBool('isLoggedIn') ?? false; // Default to false if not set
  }

  Future<List<String>> getTables(Database db) async {
    List<Map<String, dynamic>> tables = await db.rawQuery("SELECT name FROM sqlite_master WHERE type='table'");
    return tables.map((table) => table['name'] as String).toList();
  }

  Future<int?> insert(String table, Map<String, dynamic> data) async {
    var db = await dte;
    return await db?.insert(table, data);
  }

  Future<int?> deleteById(String table, int id) async {
    var db = await dte;
    return await db?.delete(table, where: 'id = ?', whereArgs: [id]);
  }

  Future<int?> updateData(String table, Map<String, dynamic> data) async {
    var db = await dte;
    return await db?.update(table, data, where: 'id = ?', whereArgs: [data['id']]);
  }

  Future<List<Map<String, dynamic>>?> readData(String table) async {
    var db = await dte;
    return await db?.query(table);
  }

  Future<List<Map<String, dynamic>>?> readById(String table, int id) async {
    var db = await dte;
    return await db?.query(table, where: 'id = ?', whereArgs: [id]);
  }

  // New methods to save and retrieve user name and email
  
}