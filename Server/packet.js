var zeroBuffer = new Buffer("00", "hex");
module.exports = packet = {

	// params: an array of javascript objects to be turned into buffers
	build: function(params){
		var packetParts = [];
		var packetSize = 0;
		
		params.forEach(function(param){
			var buffer;
			
			if (typeof(param === "string")){
			/* GameMaker takes 00 terminated strings */
				buffer = new Buffer(param, "utf8");
				
				/* Buffer length + 1 to add zero buffer */
				buffer = Buffer.concat([buffer, zeroBuffer], buffer.length + 1);
			}
			else if (typeof(param === "number")){
				/* 2 bytes. Uint16 */
				buffer = new Buffer(2);
				
				// Position 0
				buffer.writeUInt16LE(param, 0);
			}
			else {
				console.log("Warning: Unknown data type in packet builder!");
			}
			
			packetSize += buffer.length;
			packetParts.push(buffer);
		});
		
		var dataBuffer = Buffer.concat(packetParts, packetSize);
		
		var size = new Buffer(1);
		size.writeUInt8(dataBuffer.length + 1, 0);
		
		var finalPacket = Buffer.concat([size, dataBuffer], size.length + dataBuffer.length);
		
		return finalPacket;
	}

};