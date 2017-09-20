
// declare wasm functions 
let set_WorldWidth;
let get_WorldWidth;
let convDezToBin;
let wasmFindEnvorimentCode;
let conv2Dto1D;


function main(){
  // use mini-wasm from https://github.com/maierfelix/momo

  let _import = {
    error: (msg) => { throw new Error(msg) },
    log: function() { console.log.apply(console, arguments); }
  };
  compile(code, _import).then((result) => {
    // fill functions 
    set_WorldWidth = result.exports.set_WorldWidth;
    get_WorldWidth = result.exports.get_WorldWidth;
    convDezToBin = result.exports.convDezToBin;
    wasmFindEnvorimentCode = result.exports.wasmFindEnvorimentCode;
    conv2Dto1D = result.exports.conv2Dto1D;

    try{
      initGame();
    }catch(e){console.log(e)};
  });

}
main();