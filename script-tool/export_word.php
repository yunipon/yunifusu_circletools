<?php
require __DIR__ . '/vendor/autoload.php';

use PhpOffice\PhpWord\PhpWord;
use PhpOffice\PhpWord\IOFactory;

$html = $_POST['html'] ?? '';

$phpWord = new PhpWord();

$section = $phpWord->addSection([
  'textDirection' => 'tbRl'
]);

\PhpOffice\PhpWord\Shared\Html::addHtml($section, $html);

header("Content-Type: application/vnd.openxmlformats-officedocument.wordprocessingml.document");
header("Content-Disposition: attachment; filename=vertical_script.docx");

$objWriter = IOFactory::createWriter($phpWord, 'Word2007');
$objWriter->save("php://output");
exit;
