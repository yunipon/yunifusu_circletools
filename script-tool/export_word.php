<?php

require __DIR__ . '/vendor/autoload.php';

use PhpOffice\PhpWord\PhpWord;
use PhpOffice\PhpWord\IOFactory;

$phpWord = new PhpWord();

$section = $phpWord->addSection([
  'textDirection' => 'tbRl'
]);

$section->addText("縦書きテストです");

header("Content-Type: application/vnd.openxmlformats-officedocument.wordprocessingml.document");
header("Content-Disposition: attachment; filename=test.docx");

$writer = IOFactory::createWriter($phpWord, 'Word2007');
$writer->save("php://output");

exit;
