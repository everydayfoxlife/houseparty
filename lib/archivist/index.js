/**
 * This is your Archivist topic/index configuration.
 * For more information, please read the Archivist documentation.
 */


function requireArchivistFile(filename) {
	var archivistFile = require(filename);
	for (var topic in archivistFile) {
		if (!archivistFile.hasOwnProperty(topic)) {
			continue;
		}

		if (exports[topic]) {
			throw new Error ('Topic "' + topic + '" already exists inside archivist files');
		}

		exports[topic] = archivistFile[topic];
	}
}


requireArchivistFile('./mage.js');
requireArchivistFile('./ident.js');
requireArchivistFile('./userData.js');
requireArchivistFile('./staticData.js');
requireArchivistFile('./game.js');