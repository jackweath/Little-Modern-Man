function reset() {
	$("#cpu textarea").val(0);
	$("#memory td").text("000");
	highlightPC();
}

// Called when the IR is updated
function nextInstruction() {
	getInput();
}

var mnuList = ["LDA", "STA", "ADD", "SUB", 
	"INP", "OUT", "BRA", "BRZ", "BRP", "DAT", "HLT"];

var lineRefs = {};
var assembledCode = [];
var compiledCode = []
function toMachineCode(mnu, addr) {
	var machineCode;
	switch(mnu) {
		case "LDA":
			// Load value from mem to acc
			machineCode = "5";
			break; 
		case "STA":
			// Store acc val in address
			machineCode = "3"; 
			break; 
		case "ADD":
			// Store acc val in address
			machineCode = "1"; 
			break; 
		case "SUB":
			// Subtract val in mem from acc
			machineCode = "2";
			break; 
		case "INP":
			// Get input and put in acc
			machineCode = "901";
			break; 
		case "OUT":
			// Output acc val
			machineCode = "902";
			break;
		case "BRA":
			// Set PC to val
			machineCode = "6";
			break; 
		case "BRZ":
			// Branch if acc is 0
			machineCode = "7";
			break; 
		case "BRP":
			// Branch if acc is > -1
			machineCode = "8";
			break;
		case "DAT":
			// reserve the mem address as data
			machineCode = ""
			break;
		case "HLT":
			// Halt
			machineCode = "000";
			break; 
	}
	return machineCode;
}

function readCode(code) {
	var codeLines = code.match(/[^\r\n]+/g);

	for (var i = 0; i < codeLines.length; i++) {
		var lineCode = pad(i, 2);

		// Check no more than 3 words
		var line = codeLines[i].trim().replace(/  +/g, ' ').toUpperCase().split(' ');

		// If it is not a comment
		if (line[0].substring(0,2) != "//") {
			if (line.length > 3) {
				parseError("Too many commands on line " + (i + 1));
				break;
			} else if (line.length > 0) {
				// If there are commands
				// Check if the first word is a command
				if ($.inArray(line[0], mnuList) < 0) {
					// It is not..
					// Make a note of the shortcut
					lineRefs[line[0]] =lineCode;
					line = line.slice(1, 3);
				}

				// We need to check what the next command is
				if ($.inArray(line[0], mnuList) > -1) {
					mCode = toMachineCode(line[0]);
					if (mCode.length == 1) {
						// We need an address
						var addr = line[1];
						if (addr == null) {
							// If there's no address, create one 
							addr = "00"
							addAssembled(lineCode, line[0], addr);
							break;
						} else {
							// We have an adress. 
							// Could be a shortcut or a numbered address
							addAssembled(lineCode, line[0], addr);
						}
					} else if (mCode == "") {
						// It's a DAT command
						// so we need to reserve this address in memory
						var val;
						if (line[1] == null) {
							val = "00";
						} else {
							if (line[1].length > 2) {
								parseError("error with data on line " + (i + 1));
								break;
							} else {
								val = pad(line[1], 2);
							}
						}
						addAssembled(lineCode, line[0], val);
					} else {
						// We do NOT want an address
						if (line.length > 1) {
							parseError("Didn't want any more on line " + (i +1));
							break;
						} else {
							// We're ready to insert 
							addAssembled(lineCode, line[0], "");
						}
					}
				} else {
					parseError("Was expecting instruction on line " + (i + 1));
					break;
				}
			}
		}
	}

	// go and replace all shortcuts with the line numbers
	for (var key in lineRefs) {
		for (var x = 0; x < assembledCode.length; x++) {
			assembledCode[x] = assembledCode[x].replace(key, lineRefs[key]);
		}
	}

	console.log(assembledCode);
}

function parseError(err) {
	var text = "PARSE ERROR: " + err;
	console.log(text);
	logThis(text, true);
	assembledCode = [];
	compiledcode = [];
}

function pad(n, width, z) {
	z = z || '0';
	n = n + '';
	return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
}

function addAssembled(lineNum, command, address) {
	lineStr = lineNum + " " + command + " " + address;
	assembledCode.push(lineStr.trim());
}

function assemble() {
	assembledCode = []; // Empty
	readCode($("#yourcode").val());
	$("#compiledcode").text(assembledCode.join('\n'));

	loadToRAM();
}

function loadToRAM() {
	console.log("LOADING TO RAM");
	for (var i = 0; i < assembledCode.length; i ++) {
		var line = assembledCode[i].split(' ');
		var val = parseInt(line[0]);

		var mCode = toMachineCode(line[1]);
		if (mCode.length == 1) {
			mCode += line[2];
		} else if (mCode == "") {
			mCode = "0" + line[2];
		}

		console.log(mCode);
		compiledCode.push(mCode);
		row = (val - (val % 10)) / 10;
		cell = $("#row" + row).find("td:eq(" + (val % 10) + ")");
		cell.text(mCode);
	}
}

function readInst() {
	var command = $("#IR > textarea").val();
	var mar = $("#MAR > textarea").val();

	switch (command) {
		case "0":
			// Halt!
			break;
		case "1":
			// Add
			// Get the val at MAR addr
			// DON'T LOAD
			// Add to ACC

			break;
		case "2":
			// Substract
			break;
		case "3":
			// Store
			store();
			break;
		case "4":
			// There is no four!
			break;
		case "5":
			// Load
			load();
			break;
		case "6":
			// Branch always
			// Change PC val to mar address
			break;
		case "7":
			// Branch 0
			// If 0, change PC to mar address
			break;
		case "8":
			// Branch > -1
			// If ACC > -1, change PC to mar address
			break;
		case "9":
			// IO
			if (parseInt(mar) == 1) {
				// Then we need an input
				getInput()
			} else {
				// We give an output
			}
			break;
	}
}