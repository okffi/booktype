<?php
/**
 * config.php
 *
 * @package MCManager.includes
 */
	// General settings
	$config['general.engine'] = 'GoogleSpell';
	$config['general.engine'] = 'PSpell';
	//$config['general.engine'] = 'PSpellShell';
	//$config['general.remote_rpc_url'] = 'http://some.other.site/some/url/rpc.php';

	// PSpell settings
	$config['PSpell.mode'] = PSPELL_NORMAL;
	$config['PSpell.language'] = "fi";
	$config['PSpell.spelling'] = "";
	$config['PSpell.jargon'] = "";
	$config['PSpell.encoding'] = "utf-8";

	// PSpellShell settings
	$config['PSpellShell.mode'] = PSPELL_NORMAL;
	$config['PSpellShell.aspell'] = '';
	$config['PSpellShell.tmp'] = '';

	// Windows PSpellShell settings
	//$config['PSpellShell.aspell'] = '"c:\Program Files\Aspell\bin\aspell.exe"';
	//$config['PSpellShell.tmp'] = 'c:/temp';
?>
