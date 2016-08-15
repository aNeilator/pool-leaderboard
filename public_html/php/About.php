<?php
$THEIR_VERSION = $_GET ['VERSION'];
$THEIR_TIME = $_GET['TIME'];

$CURR_VERSION = 1.1;
$CURR_TIME="2016-06-05--18:09";

if ($THEIR_VERSION){
     echo $CURR_VERSION."#";
     echo $CURR_TIME."#";
}

// $my_variable = "<xml><entry><time>".date("Y-m-d h:i:sa") . '</time><ip>' . $_SERVER['REMOTE_ADDR'] . "</ip></entry>";
$file = 'record.xml';
// $content = serialize($my_variable);
// file_put_contents($file, $my_variable, FILE_APPEND | LOCK_EX);
$xml = simplexml_load_file($file);
$entry = $xml->entry;
$entry = $xml->addChild('entry');
$ip = $_SERVER['REMOTE_ADDR'];
$entry->addAttribute('time', gmdate("Y-m-d h:i:sa"));
// $entry->addAttribute('ip', $ip);

// $geo = file_get_contents("http://www.geoplugin.net/xml.gp?ip=".$ip);
// $meta_tags = get_meta_tags('http://www.geobytes.com/IPLocator.htm?GetLocation&template=php3.txt&IPAddress=' . $_SERVER['REMOTE_ADDR']);
// $city = 'X '.$geo;
$entry->addAttribute('origin', "http://www.geoplugin.net/xml.gp?ip=".$ip);

$xml->asXML($file);
?>
