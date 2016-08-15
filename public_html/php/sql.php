<?php

//METHODS-------------------------------------------------------------

function AddGame($WINNER, $LOSER, $DATE, $DRUNK, $db){
	//$DATE =2016-08-13 13:32:20
	//outcome = 0:no outcome, 1:player1, 2:player2
	//INSERT INTO GAMES VALUES(DEFAULT, "snehil.bhushan", "neil.diamond",DEFAULT , DEFAULT, DEFAULT)

	$LOSER=mysqli_real_escape_string($db, $LOSER);
	$WINNER=mysqli_real_escape_string($db, $WINNER);
	$DATE=mysqli_real_escape_string($db, $DATE);
	$DRUNK=mysqli_real_escape_string($db, $DRUNK);

	$q = "INSERT INTO GAMES VALUES(DEFAULT, '$WINNER', '$LOSER', '$DRUNK','$DATE');";
	echo $q;
	if ($db->query($q)){
		echo "OK\rGAME ADDED\r".$UID."\r";
	}
	else {
		echo "ERROR\r";
	}


}

function updateWinLoss($WINNER, $LOSER, $DATE, $db){
	// $q1 = "REPLACE into LEADERBOARD values('$WINNER', 1, 0, 19, DEFAULT)";
	$q1 = "UPDATE PLAYER SET WON = WON + 1 WHERE UID='$WINNER'; ";
	$q2 = "UPDATE PLAYER SET LOST = LOST + 1 WHERE UID='$LOSER'; ";
	if ($db->query($q1) && $db->query($q2)){
		echo "OK\rGAME ADDED\r".$WINNER."\r";
		return true;
	}else{
		echo "FAILED UPDATE";
		return false;
	}
}

function adjustRatings($UID, $RATING, $db){
	$q = "UPDATE PLAYER SET RATING = '$RATING' WHERE UID='$UID'; ";
	echo $q;

	if ($db->query($q)){
		echo "success ratings..";
	}else{
		echo "fail";
	}
}

function getRating($UID, $db){
	$q = "SELECT RATING FROM PLAYER WHERE UID='$UID'";
	if ($result = $db->query ( $q )) {
		while ( $row = $result->fetch_assoc () ) {
			return $row['RATING'];
		}
	}
}

function AddUser($FNAME, $LNAME, $UID, $db){

	$FNAME=mysqli_real_escape_string($db, $FNAME);
	$LNAME=mysqli_real_escape_string($db, $LNAME);
	$UID=mysqli_real_escape_string($db, $UID);

	if ($db->query("INSERT INTO PLAYER VALUES(
		'$FNAME', '$LNAME', '$UID', 0,0,0,NOW(),NOW())")){
		echo "OK\rPLAYER ADDED\r".$UID."\r";
	}
	else {
		echo "ERROR\r";
	}
}


function hasPassword(){
	$HASH = $_POST['HASH'];
	$PASS = $_POST ['PASS'];

	$secretPass = "pass";
	$secretKey="2pAk&&"; # match the value stored in the client javascript below
	$real_hash = md5($secretPass . $secretKey);
	if ($real_hash === $HASH || $PASS=== $secretPass){
		return true;
	}
	echo "Incorrect Credentials";
	return false;
}

function SecurityCheck($array){
	foreach ($array as $i => $value) {
		if (strpos($value,';')!==false ){
			echo "Security Precaution!\r";
			exit();
		}
	}
}


function ConnectToMySQL(){

	$mysql_host = "mysql1.000webhost.com";
	$mysql_database = "a5698790_pool";
	$mysql_user = "a5698790_akqa";
	$mysql_password = "qwe123";

	// Create connection
	$conn = new mysqli($mysql_host, $mysql_user, $mysql_password, $mysql_database);

	// Check connection
	if ($conn->connect_error) {
		die("Connection failed: " . $conn->connect_error);
		exit();
	}
	// echo "Connected successfully";
	return $conn;

}

function CreateTable($db){
	$query = " CREATE TABLE PLAYER(
		FNAME VARCHAR( 30 ) DEFAULT  'Neil',
		LNAME VARCHAR( 30 ) DEFAULT  'Diamond',
		UID VARCHAR( 50 ) NOT NULL PRIMARY KEY ,
		WON INT( 4 ) NOT NULL DEFAULT 0,
		LOST INT( 4 ) NOT NULL DEFAULT 0,
		RATING FLOAT( 6 ) NOT NULL ,
		Joined TIMESTAMP DEFAULT NOW(),
		DATE TIMESTAMP NOT NULL
		);

	CREATE TABLE GAMES	(
		GID int(6) PRIMARY KEY AUTO_INCREMENT,
		WINNER VARCHAR(50) NOT NULL,
		LOSER VARCHAR(50) NOT NULL,
		DRUNK TINYINT(1) default 0,
		Date TIMESTAMP DEFAULT NOW(),
		FOREIGN KEY (WINNER) REFERENCES PLAYER(UID),
		FOREIGN KEY (LOSER) REFERENCES PLAYER(UID)
	)

	CREATE TABLE  LEADERBOARD (
		UID VARCHAR( 50 ) PRIMARY KEY,
		WON INT( 4 ) NOT NULL DEFAULT 0,
		LOST INT( 4 ) NOT NULL DEFAULT 0,
		RATING FLOAT( 6 ) NOT NULL ,
		Date DATETIME DEFAULT ON UPDATE CURRENT_TIMESTAMP
	)

";
	if ($db->query($query)){
		echo "OK\rADDED\r";
		//mkdir($dir_path, 0700);
	}
	else {
		echo "ERROR\r";
	}
}
?>
