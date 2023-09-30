import BSON from 'bson';
import zlib from 'zlib';

export function Compress(json: string) {
    const bsonData = BSON.serialize(JSON.parse(json));
    const compressedData = zlib.brotliCompressSync(bsonData);

    // add 9 bytes header
    const header = Buffer.from([0x46, 0x72, 0x44, 0x54, 0x00, 0x00, 0x00, 0x00, 0x03]);
    
    const compressedDataWithHeader = Buffer.concat([header, compressedData]);
    return compressedDataWithHeader;
}

export function DeCompress(d: Buffer) {
    // remove 9 bytes header
    const data = d.slice(9);
    const decompressedData = zlib.brotliDecompressSync(data);
    const bsonData = BSON.deserialize(decompressedData);
    const jsonData = JSON.stringify(bsonData);
    return jsonData;
}
