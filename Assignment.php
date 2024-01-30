<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Latest Time Stories</title>
</head>
<body>

<div>
    <h1>Top 6 Time Stories</h1>
    <?php
    function getLatestTimeStories() { //function to fetch latest 6 stories
        $url = "https://time.com/";
        $html = file_get_contents($url);
        if ($html === FALSE) {
            return "Failed to fetch Time.com";
        }
        $latestStories = [];

        $highlightedStart = strpos($html, '<div class="homepage-module-highlight">');
        $highlightedEnd = strpos($html, '</div>', $highlightedStart);

        $highlightedContent = substr($html, $highlightedStart, $highlightedEnd - $highlightedStart);

        preg_match_all('/<a href="([^"]+)" class="headline">(.*?)<\/a>/', $highlightedContent, $matches, PREG_SET_ORDER);

        $latestStories = array_slice($matches, 0, 6);

        return $latestStories;
    }

    $latestStories = getLatestTimeStories();

    echo "<ul>";
    foreach ($latestStories as $story) { //outputs each story as a hyperlink
        echo "<li><a href='{$story[1]}'>{$story[2]}</a></li>";
    }
    echo "</ul>";
    ?>

</div>

</body>
</html>
