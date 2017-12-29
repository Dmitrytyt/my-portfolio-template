<?php defined('SYSPATH') or die('No direct script access.');

require_once('../classes/Sender.php');

$sender = new Sender();
$sender->run();