<?php
include 'sql.php';
$TYPE = $_GET ['TYPE'];
$DATERANGE = $_GET ['DATERANGE'];
$P1 = $_GET ['P1'];
$P2 = $_GET ['P2'];
// $SCORETYPE = "time";
// $CHEAT = $_POST ['QUERY'];
// $PASS = $_POST ['PASS'];
// // Create connection
//
$db = ConnectToMySQL ();

// // ------------------------------------------------------------
// $LEVEL = mysqli_real_escape_string ( $db, $LEVEL );
// $SCORE_TYPE = mysqli_real_escape_string ( $db, $SCORE_TYPE );
// $DATERANGE = mysqli_real_escape_string ( $db, $DATERANGE );
// // ---------------------------------------------------------------
// CheatDebug ( $db, $CHEAT, $PASS );
$q_s = "SELECT `GID`,`WINNER`,`LOSER`, `DRUNK`,`Date` FROM GAMES WHERE ";
$q_e = " ORDER BY DATE DESC LIMIT 20";
$q = $q_s . getQueryRange($DATERANGE) . $q_e;

if ($TYPE == "recent"){

} elseif ($TYPE == "player-single") {
	$q = $q_s . getQueryRange($DATERANGE)
			. " AND (WINNER = '$P1' || LOSER = '$P1') "
			. $q_e;

} elseif ($TYPE == "player-compare") {
	$q = $q_s . getQueryRange($DATERANGE)
			. " AND ((WINNER = '$P1' || LOSER = '$P1') && (WINNER = '$P2' || LOSER = '$P2')) "
			. $q_e;
}
elseif ($TYPE == "player-single-won") {
 $q = $q_s . getQueryRange($DATERANGE)
		 . " AND (WINNER = '$P1')"
		 . $q_e;
}
elseif ($TYPE == "player-single-lose") {
 $q = $q_s . getQueryRange($DATERANGE)
		 . " AND (LOSER = '$P1')"
		 . $q_e;
}
elseif ($TYPE == "leaderboard") {

	// (SELECT COUNT(*) FROM GAMES
	// WHERE WINNER = p.UID) as WON,
	// (SELECT COUNT(*) FROM GAMES
	// WHERE LOSER = p.UID) as LOST
	$q_s = "SELECT
	@curRank := @curRank + 1 AS RANK,
	CONCAT_WS(' ', p.FNAME, p.LNAME) AS NAME,
	p.WON as WON, p.LOST as LOST, ROUND(p.RATING,2) as SCORE
	FROM PLAYER p, (SELECT @curRank := 0) r ";

	$q_e = " ORDER BY SCORE DESC";
	$q = $q_s . $q_e;
}
elseif ($TYPE == "player-all") {

	$q_s = "SELECT UID FROM PLAYER";
	$q_e = " ORDER BY UID DESC";
	$q = $q_s . $q_e;
}
else{
	exit();
}



parseQueryAsJson($q, $db);

function parseQueryAsJson($q, $db){
		// echo $q;
		if ($result = $db->query ( $q )) {
			$rows = array();
			while ( $row = $result->fetch_assoc () ) {
				$rows[] = $row;
			}
		}
		print json_encode($rows);

}

function getQueryRange($date_range){
	$q_range = "Date IS NOT NULL";
	if ($date_range == "year")
		$q_range = "Date > DATE_SUB(NOW(), INTERVAL 1 YEAR)";
	else if ($date_range == "week")
		$q_range = "Date > DATE_SUB(NOW(), INTERVAL 1 WEEK)";
	else if ($date_range == "month")
		$q_range = "Date > DATE_SUB(NOW(), INTERVAL 1 MONTH)";
	else if ($date_range == "day")
		$q_range = "Date > DATE_SUB(NOW(), INTERVAL 1 DAY)";
	else if ($date_range == "hour")
		$q_range = "Date > DATE_SUB(NOW(), INTERVAL 1 HOUR)";

return $q_range;
}
