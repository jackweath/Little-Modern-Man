var c, ctx, cpuPad;
var rainbow = ["#FF0000", "#FF7F00", "#FFFF00", "#00FF00", "#0000FF", "#4B0082", "#8F00FF"]

function moveIO() {
	var y = $("#alu").position().top + $("#alu").outerHeight() + 16;
	$("#io").css({top: y});
}

function drawConnections() {
	moveIO();
	console.log("Drawing connections")
	c = document.getElementById("connections");
	ctx = c.getContext("2d");
	ctx.canvas.width = $(".lmc").width();
	ctx.canvas.height = $(".lmc").height();
	canvHeight = c.height;
	canvWidth = c.width;

	cpu = $("#cpu");
	// CPU is at (0, 0)
	var lim = 4;
	cpuPad = (cpu.outerWidth() - cpu.width()) /2;
	cpuRight = cpuPad * 1.5 + cpu.width(); // Gets padding starts between edge of CPU and textarea
	cpuTextHeight = $("#ACC textarea").height();
	cpuBoxHeight = $("#ACC").height();
	cpuStartLine = $("#ACC").position().top + cpuBoxHeight/ lim;

	ctx.globalAlpha = 1;
	ctx.lineWidth = 5;

	var radius = 2;
	

	aluStartY = cpu.outerHeight() - cpuPad /2;
	aluStartX = cpuPad * 1.5;
	aluEndY = $("#alu").position().top + cpuPad / 2;
	for (var i = 0; i < lim; i ++) {
		ctx.strokeStyle=rainbow[i % rainbow.length];
		ctx.beginPath();
		ctx.moveTo(aluStartX + i * ctx.lineWidth, aluStartY);
		ctx.lineTo(aluStartX + i * ctx.lineWidth, aluEndY);
		ctx.stroke();
	}
	

	var mid = $("#row5").position().top;
	var finalX, finalY;
	for (var i = 0; i < 10; i++) {
		ctx.strokeStyle=rainbow[i % rainbow.length];
		var row = $("#row" + i);
		var startY = row.position().top + row.height() / 2;
		var startX = $("#memory").position().left + 4;

		ctx.beginPath();
		ctx.moveTo(startX, startY);

		startX = startX - 5 - ctx.lineWidth * Math.abs((4.5 - i));
		ctx.lineTo(startX, startY);

		if (i > 5) {
			ctx.arc(startX, startY - radius, radius, Math.PI / 2, Math.PI, 0);
			startX = startX - radius;
			ctx.moveTo(startX, startY - radius);
		} else if (i < 4) {
			ctx.arc(startX, startY + radius, radius, Math.PI * 1.5, Math.PI, 1);
			startX = startX - radius;
			ctx.moveTo(startX, startY + radius);
		} else {
			ctx.lineTo(startX, startY - radius);
		}

		
		
		startY = $("#row0").position().top + $("#row0").height()/2;
		startY = mid - ctx.lineWidth * (5 - i);
		ctx.lineTo(startX, startY);
		//

		if (i >= 5) {
			ctx.arc(startX - radius, startY, radius, 0, Math.PI * 1.5, 1);
			startY = startY - radius;
		} else {
			ctx.arc(startX - radius, startY, radius, 0, Math.PI * 0.5, 0);
			startY = startY + radius;
		} 

		startX = $("#memory").position().left - 7 * ctx.lineWidth;
		ctx.lineTo(startX, startY);
		ctx.stroke();

		finalX = startX;
	}

	for (var i = 0; i < lim; i++) {
		ctx.strokeStyle=rainbow[i % rainbow.length];
		ctx.beginPath();
		var startX = cpuRight;
		var startY = cpuStartLine + ctx.lineWidth * i;
		ctx.moveTo(startX, startY);
		ctx.lineTo(finalX, startY);
		ctx.stroke();
	}

	var blockPad = 2;
	ctx.fillStyle = "#A2B5CD";
	finalY = mid - 6 * ctx.lineWidth;
	ctx.fillRect(finalX - 20, finalY, 20,ctx.lineWidth * 10 + 2 * blockPad)

	for (var i = 0; i < 6; i++) {
		ctx.strokeStyle=rainbow[i % rainbow.length];
		var endY = aluStartY + 2 * cpuPad + (6 - i) * ctx.lineWidth;
		var startX = $("#alu").position().left + $("#alu").outerWidth() - ctx.lineWidth *(6 - i) - cpuPad * 0.5;

		ctx.beginPath();
		ctx.moveTo(startX, aluStartY);
		ctx.lineTo(startX, endY);
		ctx.arc(startX + radius, endY, radius, Math.PI, Math.PI/2, 1);


		endX = $("#io").width() - ctx.lineWidth * (6 -i) - cpuPad * 0.5 - radius;
		endY = endY + radius;
		ctx.moveTo(startX + radius, endY);
		ctx.lineTo(endX, endY);
		endY += radius
		ctx.arc(endX, endY, radius, Math.PI * 1.5, 0);
		endX += radius
		ctx.moveTo(endX, endY);

		if (i < 3) {
			endY = $("#io").position().top + $("#io > #input").position().top + $("#input > textarea").position().top + cpuPad * 0.5;
			ctx.lineTo(endX, endY);
		} else {
			endY += 50;
			ctx.lineTo(endX, endY);
			endX += radius;
			ctx.arc(endX, endY, radius, Math.PI, Math.PI/2, 1);
			endY += radius;
			startX = endX;
			endX = (i) * ctx.lineWidth + $("#io").outerWidth();
			ctx.moveTo(startX, endY);
			ctx.lineTo(endX, endY);
			endY += radius
			ctx.arc(endX, endY, radius, Math.PI * 1.5, 0);
			endX += radius;
			ctx.moveTo(endX, endY);

			endY = $("#io").position().top + $("#io > #output").position().top + $("#output > textarea").position().top  - $("#output > textarea").height()/2 + cpuPad * 0.5 + i * ctx.lineWidth;
			ctx.lineTo(endX, endY);

			endX -= radius;
			ctx.arc(endX, endY, radius, 0, Math.PI * 0.5);
			endY += radius;
			ctx.moveTo(endX, endY);

			endX = $("#io").width() +cpuPad * 0.5;
			ctx.lineTo(endX, endY);

		}

		ctx.stroke();
	}

}

var speed = 1000;
function bubble(textVal, x, y, id, color) {
	var bubble = $("<div/>", {class: "data", id: id});
	bubble.text(textVal);
	bubble.offset({top: y, left: x});
	bubble.css({background: color});
	$(".lmc").append(bubble);
	var height = $("#" + id).height();
	var width = $("#" + id).width();

	if (width > height) {
		$("#" + id).height($("#" + id).width());
	} else {
		$("#" + id).width($("#" + id).height());
	}	
}

function bubbleMoveBy(id, x, y, callback) {
	var bubble = $("#" + id);
	bubble.animate({left: "+=" + x, top: "+=" + y}, speed, callback);
}

function bubbleMoveTo(id, x, y, callback) {
	var bubble = $("#" + id);
	bubble.animate({left: x, top: y}, speed, callback);
}

function bubblePop(id) {
	$("#" + id).remove();
}

function highlightPC() {
	$("#memory td").removeClass("pchighlight");
	val = getPCVal();

	row = (val - (val % 10)) / 10;
	cell = $("#row" + row).find("td:eq(" + (val % 10) + ")");
	cell.addClass("pchighlight");
}

function flashBubble(val, x, y, color, duration, callback) {
	bubble(val, x, y, "temp", color);
	var prevSpeed = speed;
	speed = duration;
	bubbleMoveBy("temp", 0, 0, function() {
		bubblePop("temp");
		callback();
	});
	speed = prevSpeed;
}

function incrementPC() {
	highlightPC();
	var x = $("#PC textarea").position().left;
	var y = $("#PC").position().top;
	var x2 = $("#PC").position().left;

	var val = getPCVal();

	bubble(val, x, y, "PCbubble", "rgba(255, 0, 0, 0.8)");
	
	bubbleMoveTo("PCbubble", x2, y);
	y2 = $("#alu").position().top + $("#alu").height() /2;
	bubbleMoveTo("PCbubble", x2, y2, function() {
		aluOp("+1", function() {
			var newVal = parseInt($("#PCbubble").text()) + 1;
			$("#PCbubble").text(newVal);

			bubbleMoveTo("PCbubble", x, y, function() {
				$("#PC textarea").val(newVal);
				bubblePop("PCbubble");
				highlightPC();
			});
		});
	});		
}

function aluOp(text, callback) {
	var alu = $("#alu");
	var x = alu.position().left + alu.width() /2;
	var y = alu.position().top + alu.outerHeight() /2;

	flashBubble("+1", x, y2, "rgba(0, 255, 0, 0.5)", 500, function() {
		callback();
	});
}

function getPCVal() {
	pc = $("#PC textarea");
	val = pc.val();
	return val;
}

function fetchInstruction() {
	// Every time an instruction is fetched, the PC is incremented
	incrementPC();
	var currentCell = $(".pchighlight");

	// go down to acc middle
	var x = $("#PC textarea").position().left;
	var y = $("#PC").position().top;

	var bubbleId =  "PCcollector";
	bubble(getPCVal, x, y, bubbleId, "rgba(255, 0, 0, 0.8)");

	y = $("#ACC").position().top;
	bubbleMoveTo(bubbleId, x, y, function() {
		toMemory(bubbleId, currentCell, function() {
			bubblePop(bubbleId);
			x = currentCell.position().left + $("#memory").position().left;
			y = currentCell.position().top;
			bubble(currentCell.text(), x, y, bubbleId, "rgba(0, 0, 255, 0.8)");
			fromMemory(bubbleId, function() {
				x = $("#PC textarea").position().left;
				y = $("#MAR").position().top;
				bubbleMoveTo(bubbleId, x, y, function() {
					$("#MAR textarea").text($("#" + bubbleId).text().substring(1, 3));
					y = $("#IR").position().top;
					bubbleMoveTo(bubbleId, x, y, function() {
						$("#IR textarea").text($("#" + bubbleId).text().substring(0, 1));
						bubblePop(bubbleId);
						getInput();
					});
				});
			});
		});
	});
}

function getInput() {
	logThis("Enter a numerical input between 999 and -999");
	$("#io > #input > textarea").attr("readonly", false);
	
	$("#io > #input textarea").animate({backgroundColor: "#CD5555"}, 500, function() {
		$("#io > #input textarea").animate({backgroundColor: "#FFF"}, 500);	
	});
}

function useInput() {
	var inputtext = $("#io > #input > textarea");
	var inp = inputtext.val();
	inputtext.attr("readonly", true);
	var bubbleId = "inputData"
	inputtext.val("");

	var y = $("#io").position().top + $("#io > #input").position().top + inputtext.position().top + cpuPad * 0.5;
	var x = $("#io").width() - cpuPad * 5;
	bubble(inp, x, y, bubbleId, dataCol);

	x = $("#io").width() - cpuPad * 5;
	y = $("#cpu").outerHeight() - cpuPad /2 + 2 * cpuPad;

	bubbleMoveTo(bubbleId, x, y, function() {
		y = $("#ACC").position().top;
		x = $("#ACC textarea").position().left;
		bubbleMoveTo(bubbleId, x, y, function() {
			$("#ACC textarea").val(inp);
			bubblePop(bubbleId);
		});
	});
}

function logThis(text, err) {
	if (err) {
		$("#log").html("<span style='color: red;'>" + text + "</span>");
	} else {
		$("#log").text(text);
	}
}

function logClear() {
	$("#log").text("...");
}

function test() {
	fetchInstruction();
}

// Goes from ACC entry to Memory cell
function toMemory(bubbleId, currentCell, callback) {
	var y = $("#ACC").position().top;
	var x = $("#memory").position().left - 7 * ctx.lineWidth;
	bubbleMoveTo(bubbleId, x, y, function() {
		y = currentCell.position().top;
		bubbleMoveTo(bubbleId, x, y, function () {
			x = currentCell.position().left + $("#memory").position().left;
			bubbleMoveTo(bubbleId, x, y, function () {
				callback();
			});
		});
	});
}

function fromMemory(bubbleId, callback) {
	var y = $("#ACC").position().top;
	var x = $("#memory").position().left - 7 * ctx.lineWidth;

	bubbleMoveTo(bubbleId, x, y, function() {
		x = $("#ACC textarea").position().left;
		bubbleMoveTo(bubbleId, x, y, function() {
			callback();
		});
	});
}

function findCell(val) {
	var row = (val - (val % 10)) / 10;
	var cell = $("#row" + row).find("td:eq(" + (val % 10) + ")");

	return cell;
}

var dataCol = "rgba(0, 0, 255, 0.8)";
var addrCol = "rgba(255, 0, 0, 0.8)";

function store() {
	var bubbleId = "ACCstore";
	var acc = $("#ACC textarea");
	var val = acc.val();
	var pos = acc.position();
	var mar = $("#MAR textarea").val();
	var cell = findCell(parseInt(mar));
	var bubbleId2 = "MARstore";
	bubble(mar, pos.left, pos.top, bubbleId2, addrCol);
	bubbleMoveBy(bubbleId2, 5, 0, function() {
		toMemory(bubbleId2, cell, function() {
			bubblePop(bubbleId2);
		});
	});	

	
	setTimeout(function() {
	bubble(val, pos.left, pos.top, bubbleId, dataCol);
		bubbleMoveBy(bubbleId, 5, 0, function() {
			console.log(bubbleId);
			toMemory(bubbleId, cell, function() {
				cell.text(val);
				bubblePop(bubbleId);
				console.log(bubbleId);
			});
		});
	}, 500);
}

function load() {
	var bubbleId = "Loader";
	var mar = $("#MAR textarea");
	var cell = findCell(parseInt(mar.val()));
	var pos = $("#ACC textarea").position();

	bubble(mar.val(), mar.position().left, mar.position().top, bubbleId, addrCol);
	
	bubbleMoveTo(bubbleId, pos.left, pos.top, function() {
		toMemory(bubbleId, cell, function() {
			pos = $("#" + bubbleId).position();
			bubblePop(bubbleId);
			bubble(cell.text(), pos.left, pos.top, bubbleId, dataCol);
			fromMemory(bubbleId, function() {
				$("#ACC textarea").val($("#" + bubbleId).text());
				bubblePop(bubbleId);
			});
		});
	});	
}

// Branch animation
// 	* Check IF (if necessary)
// 	* MAR to PC

// Output animation