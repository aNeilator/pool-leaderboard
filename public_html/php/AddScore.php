<?php
include 'sql.php';

$FNAME = $_POST['FNAME'];
$LNAME = $_POST['LNAME'];
$UID= $_POST['UID'];

//--------------------------------------------

if (hasPassword()) {

	$db = ConnectToMySQL();
	echo "Success Authentication";
	AddUser($FNAME, $LNAME, $UID, $db);
} else{
	echo "Failed Authentication";
}


?>
