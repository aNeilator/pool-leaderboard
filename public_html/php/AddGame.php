<?php
include 'sql.php';

$WINNER= $_POST['WINNER'];
$LOSER= $_POST['LOSER'];
$DATE= $_POST['DATE'];
$DRUNK= $_POST['DRUNK'];
//--------------------------------------------
if (hasPassword()) {
	if (!$DATE){
		date_default_timezone_set("Europe/London");
		$DATE = date('Y-m-d H:i:s');
	}
	$db = ConnectToMySQL();
	echo "Success Authentication";

	// AddGame($WINNER, $LOSER, $DATE, $DRUNK, $db);
	echo "Adjusting Rating...";
	if (updateWinLoss($WINNER, $LOSER, $DATE, $db)){
		$rating1 = getRating($WINNER, $db);
		$rating2 = getRating($LOSER, $db);

		echo "CURR RATING 1: $rating1";
		echo "CURR RATING 2: $rating2";

		$rating = new Rating($rating1, $rating2, 1,0);
		$results = $rating->getNewRatings();

		echo "New rating for player A: " . $results['a'];
		echo "New rating for player B: " . $results['b'];

		adjustRatings($WINNER, $results['a'], $db);
		adjustRatings($LOSER, $results['b'], $db);

	}

} else{
	echo "Failed Authentication";
}


class Rating
{

    /**
     * @var int The K Factor used.
     */
    const KFACTOR = 16;

    /**
     * Protected & private variables.
     */
    protected $_ratingA;
    protected $_ratingB;

    protected $_scoreA;
    protected $_scoreB;

    protected $_expectedA;
    protected $_expectedB;

    protected $_newRatingA;
    protected $_newRatingB;

    /**
     * Costructor function which does all the maths and stores the results ready
     * for retrieval.
     *
     * @param int Current rating of A
     * @param int Current rating of B
     * @param int Score of A
     * @param int Score of B
     */
    public function  __construct($ratingA,$ratingB,$scoreA,$scoreB)
    {
        $this->_ratingA = $ratingA;
        $this->_ratingB = $ratingB;
        $this->_scoreA = $scoreA;
        $this->_scoreB = $scoreB;

        $expectedScores = $this -> _getExpectedScores($this -> _ratingA,$this -> _ratingB);
        $this->_expectedA = $expectedScores['a'];
        $this->_expectedB = $expectedScores['b'];

        $newRatings = $this ->_getNewRatings($this -> _ratingA, $this -> _ratingB, $this -> _expectedA, $this -> _expectedB, $this -> _scoreA, $this -> _scoreB);
        $this->_newRatingA = $newRatings['a'];
        $this->_newRatingB = $newRatings['b'];
    }

    /**
     * Set new input data.
     *
     * @param int Current rating of A
     * @param int Current rating of B
     * @param int Score of A
     * @param int Score of B
     */
    public function setNewSettings($ratingA,$ratingB,$scoreA,$scoreB)
    {
        $this -> _ratingA = $ratingA;
        $this -> _ratingB = $ratingB;
        $this -> _scoreA = $scoreA;
        $this -> _scoreB = $scoreB;

        $expectedScores = $this -> _getExpectedScores($this -> _ratingA,$this -> _ratingB);
        $this -> _expectedA = $expectedScores['a'];
        $this -> _expectedB = $expectedScores['b'];

        $newRatings = $this ->_getNewRatings($this -> _ratingA, $this -> _ratingB, $this -> _expectedA, $this -> _expectedB, $this -> _scoreA, $this -> _scoreB);
        $this -> _newRatingA = $newRatings['a'];
        $this -> _newRatingB = $newRatings['b'];
    }

    /**
     * Retrieve the calculated data.
     *
     * @return Array An array containing the new ratings for A and B.
     */
    public function getNewRatings()
    {
        return array (
            'a' => $this -> _newRatingA,
            'b' => $this -> _newRatingB
        );
    }

    /**
     * Protected & private functions begin here
     */

    protected function _getExpectedScores($ratingA,$ratingB)
    {
        $expectedScoreA = 1 / ( 1 + ( pow( 10 , ( $ratingB - $ratingA ) / 400 ) ) );
        $expectedScoreB = 1 / ( 1 + ( pow( 10 , ( $ratingA - $ratingB ) / 400 ) ) );

        return array (
            'a' => $expectedScoreA,
            'b' => $expectedScoreB
        );
    }

    protected function _getNewRatings($ratingA,$ratingB,$expectedA,$expectedB,$scoreA,$scoreB)
    {
        $newRatingA = $ratingA + ( self::KFACTOR * ( $scoreA - $expectedA ) );
        $newRatingB = $ratingB + ( self::KFACTOR * ( $scoreB - $expectedB ) );

        return array (
            'a' => $newRatingA,
            'b' => $newRatingB
        );
    }
}

// $rating = new Rating(0, 0, 0,1);
// $results = $rating->getNewRatings();

// echo "New rating for player A: " . $results['a'];
// echo "New rating for player B: " . $results['b'];

?>
