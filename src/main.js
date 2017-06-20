
// declare wasm functions 
let wasmFindEnvorimentCode;
let convertToBin;

function main(){
  // use mini-wasm from https://github.com/maierfelix/mini-wasm

  let _import = {
    error: (msg) => { throw new Error(msg) },
    log: function() { console.log.apply(console, arguments); }
  };
  compile(code, _import).then((result) => {
    // fill functions 
    wasmFindEnvorimentCode = result.exports.wasmFindEnvorimentCode;
    convertToBin = result.exports.convertToBin;

    initGame();
  });

}
main();