<?php
// Database connection details for the first database
$first_db = [
    'host' => 'localhost',    // First database host
    'user' => 'root',    // First database username
    'password' => 'c85863_9f3ccae9_bc', // First database password
    'name' => 'weedreviews_wp'     // First database name
];

// Database connection details for the second (WordPress) database
$wp_db = [
    'host' => 'localhost',    // WordPress database host
    'user' => 'root',    // WordPress database username
    'password' => 'c85863_9f3ccae9_bc', // WordPress database password
    'name' => 'dispensaryadventures'     // WordPress database name
];

// Connect to the first database
$first_conn = new mysqli($first_db['host'], $first_db['user'], $first_db['password'], $first_db['name']);
if ($first_conn->connect_error) {
    die("Connection failed to the first database: " . $first_conn->connect_error);
}

// Fetch data from the first database
$attachment_data = [];
$sql = "SELECT ID, guid FROM wp_posts WHERE post_type = 'attachment'";
$result = $first_conn->query($sql);

if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $id = $row['ID'];
        $filename = pathinfo(basename($row['guid']), PATHINFO_FILENAME);
        $attachment_data[$filename] = $id;
        echo "Fetched ID: {$id}, Filename: {$filename}\n";
    }
} else {
    echo "No attachments found in the first database.\n";
}
$first_conn->close();
print(@json_encode($attachment_data));
// Connect to the WordPress database
$wp_conn = new mysqli($wp_db['host'], $wp_db['user'], $wp_db['password'], $wp_db['name']);
if ($wp_conn->connect_error) {
    die("Connection failed to the WordPress database: " . $wp_conn->connect_error);
}

// Fetch all attachments from the WordPress database
$sql = "SELECT ID, guid FROM wp_posts WHERE post_type = 'attachment'";
$result = $wp_conn->query($sql);

if ($result->num_rows > 0) {
    $processed = 0;
    $updated = 0;

    while ($row = $result->fetch_assoc()) {
        $processed++;
        $old_id = $row['ID'];
        $filename = preg_replace('/-\d+x\d+$/', '', basename($row['guid']));


        echo "Processing attachment {$processed}: {$filename} ( ORIGINAL: {$row['guid']} )\n";

        if (isset($attachment_data[$filename])) {
            $new_id = $attachment_data[$filename];

            if ($old_id != $new_id) {
                echo "  Updating ID from {$old_id} to {$new_id}\n";

                // Update the post ID in wp_posts table
                $update_post = "UPDATE wp_posts SET ID = ? WHERE ID = ?";
                $stmt = $wp_conn->prepare($update_post);
                $stmt->bind_param('ii', $new_id, $old_id);
                $result_post = $stmt->execute();

                // Update post meta
                $update_meta = "UPDATE wp_postmeta SET post_id = ? WHERE post_id = ?";
                $stmt_meta = $wp_conn->prepare($update_meta);
                $stmt_meta->bind_param('ii', $new_id, $old_id);
                $result_meta = $stmt_meta->execute();

                if ($result_post && $result_meta) {
                    echo "  Successfully updated ID from {$old_id} to {$new_id}\n";
                    $updated++;
                } else {
                    echo "  ERROR: Failed to update post ID or post meta.\n";
                }
                $stmt->close();
                $stmt_meta->close();
            } else {
                echo "  IDs are already the same, no update needed.\n";
            }
        } else {
            echo "  No mapping found for this filename. Skipping.\n";
        }
        
    }
} else {
    echo "No attachments found in the WordPress database.\n";
}

echo "Media ID reassignment complete.\n";
echo "Processed {$processed} attachments.\n";
echo "Updated {$updated} attachments.\n";

$wp_conn->close();
?>
