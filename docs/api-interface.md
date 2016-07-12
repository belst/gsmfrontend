_[S: Server, C: Client]_

# General Information

## Verbindungsaufbau:
1. C: startet WS Verbindung
2. C: sendet Login
3. S: wenn Login korrekt -> sende "OK" zusammen mit einem (zufälligen) Token  
wenn Login falsch -> sende "6 => failed apilogin request" Error-Nachricht
4. C+S: bidirektionale nachrichtenbasierte Kommunikation

## Verbindungsabbruch:
Token ab diesem Zeitpunkt noch x Minuten (x=15) gültig
1. S: Ablaufzeitpunkt für Token setzen
2. C: startet WS Verbindung
3. C: sendet Token
4. S: wenn Token bekannt und noch gültig -> sende "OK" mit neuem (zufälligem) Token und lösche altes Token  
wenn Token abgelaufen oder nicht bekannt -> sende "6 => failed apilogin request" Error-Nachricht
5. C+S: bidirektionale nachrichtenbasierte Kommunikation

## Beenden:
1. C/S: beendet WS-Verbindung
2. S: Ablaufzeitpunkt für Token setzen


## Request Nachrichtenformat: (C->S)
```json
{
    "type": "request",
    "subtype": "<...>",
    "id": <any_number>,
    "data": <json_object>
}
```

## Answer Nachrichtenformat: (S->C nach einem Request)
```json
{
    "type": "answer",
    "subtype": "<...>",
    "id": <same_as_request_id>,
    "error": 0,
    "errormessage": "",
    "data": <json_object>
}
```

## Event Nachrichtenformat: (Push-Nachricht S->C)
```json
{
    "type": "event",
    "subtype": "<...>",
    "data": <json_object>
}
```

# Errorcodes
```
1 => request format error (answer id hier dann hardcoded auf -1, weil eventuell nicht lesbar, außerdem wird die Verbindung beendet!)
2 => too much data for one frame
3 => not logged in
4 => unknown request subtype
5 => wrong message data format
6 => failed apilogin request
7 => no permission to process request
8 => (getconfig/getlanguage) error reading file
9 => (writeconfig/writelanguage) error writing file
10 => (deleteconfig/deletelanguage) error deleting file
```

# Nachrichtenkatalog
## apilogin
### Request -->
```json
"data": {
    "username": <string|null>,
    "password": <string|null>,
    "token": <string|null>
}
```
### Answer <--
```json
"data": {
    "token": <string>
}
```

## getplayers
### Request -->
```json
"data": null
```
### Answer <--
```json
//Gibt alles von der Player->getPlayerInfos() zurück.
"data": [
    {"ip": "1.2.3.4", "pid": 8, ...},
    {"ip": "2.3.4.5", "pid": 9, ...}
]
```

## getconfig
### Request -->
```json
"data": {
    "file": <string>
}
```
### Answer <--
```json
"data": <string>
```

## deleteconfig
### Request -->
```json
"data": {
    "file": <string>
}
```
### Answer <--
```json
"data": null
```

## writeconfig
### Request -->
```json
"data": {
    "file": <string>,
    "content": <string>
}
```
### Answer <--
```json
"data": null
```

## getlanguage
### Request -->
```json
"data": {
    "file": <string>
}
```
### Answer <--
```json
"data": <string>
```

## deletelanguage
### Request -->
```json
"data": {
    "file": <string>
}
```
### Answer <--
```json
"data": null
```

## writelanguage
### Request -->
```json
"data": {
    "file": <string>,
    "content": <string>
}
```
### Answer <--
```json
"data": null
```

## addtoken
### Request -->
```json
"data": {
    "group": <string>
}
```
### Answer <--
```json
"data": <string>
```

## gettokens
### Request -->
```json
"data": null
```
### Answer <--
```json
"data": {
    <token>: <group>,
    <token>: <group>
}
```

## deletetoken
### Request -->
```json
"data": {
    "token": <string>
}
```
### Answer <--
```json
"data": <bool>
```

## executeingamecommand
### Request -->
```json
"data": {
    "command": <string>
}
```
### Answer <--
Der String in data beinhaltet alle Ausgaben, die der Spieler im Normalfall ingame über eine PM bekommen hätte. In vielen Fällen sollte data also ein leerer String sein.
```json
"data": <string>
```

## getplugins
### Request -->
```json
"data": null
```
### Answer <--
```json
"data": {
    "plugin.name.space1": {"information": <...>, "compatibility": <...>, "state": <...>},
    "plugin.name.space2": {"information": <...>, "compatibility": <...>, "state": <...>}
}
```

## quitgsmanager
### Request -->
```json
"data": null
```
### Answer <--
```json
"data": true
```

## getbanlist
### Request -->
```json
"data": null
```
### Answer <--
```json
"data": <BanHelper::getAllBans()>
```

## permissiontest
### Request -->
```json
"data": [
    "permission1",
    "permission2"
]
```
### Answer <--
```json
"data": {
    "permission1": <bool>,
    "permission2": <bool>
}
```

## getcommandpermissions
### Request -->
```json
"data": null
```
### Answer <--
```json
"data": [
    "permission1",
    "permission2",
    "some.other.per.mission"
]
```
## getplayerinfo
### Request -->
```json
"data": {
    "databaseid": <int>
}
```
### Answer <--
```json
"data": {
    "user": <database_row>,
    "stats": <database_row>,
    ...
}
```

## subscribeevent
### Request -->
```json
"data": {
    "name": <string>
}
```
### Answer <--
```json
"data": null
```

## unsubscribeevent
### Request -->
```json
"data": {
    "name": <string>
}
```
### Answer <--
```json
"data": null
```

## listpresetfiles
### Request -->
```json
"data": null
```
### Answer <--
```json
"data": [
    <string>,
    <string>,
    ...
]
```