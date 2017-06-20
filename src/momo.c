let code = `// momo code


  extern int convertToBin(int input) {
    if (input == 0) {return 0;}
    else if (input == 1) {return 1;}
    else if (input == 10) {return 2;}
    else if (input == 11) {return 3;}
    else if (input == 100) {return 4;}
    else if (input == 101) {return 5;}
    else if (input == 110) {return 6;}
    else if (input == 111) {return 7;}
    else if (input == 1000) {return 8;}
    else if (input == 1001) {return 9;}
    else if (input == 1010) {return 10;}
    else if (input == 1011) {return 11;}
    else if (input == 1100) {return 12;}
    else if (input == 1101) {return 13;}
    else if (input == 1110) {return 14;}
    else if (input == 1111) {return 15;}
   	return 0;
 };

extern int wasmFindEnvorimentCode(int envmode,int typ, int typO,int typR,int typU,int typL) {
    int worldEnv0 = 0;int worldEnv1 = 0;int worldEnv2 = 0;int worldEnv3 = 0;
    if (envmode == 0){return 0;}
    else if (envmode == 1){
      if (typO == typ) {worldEnv0 = 1;}
      if (typR == typ) {worldEnv1 = 1;}
      if (typU == typ) {worldEnv2 = 1;}
      if (typL == typ) {worldEnv3 = 1;}
    }
    else if (envmode == 3){
      if (typO == 0 || typO == 2) {worldEnv0 = 1;}
      if (typR == 0 || typR == 2) {worldEnv1 = 1;}
      if (typU == 0 || typU == 2) {worldEnv2 = 1;}
      if (typL == 0 || typL == 2) {worldEnv3 = 1;}
    }
    else {return 0}
    convertToBin(worldEnv0 * 1000 + worldEnv1 * 100 + worldEnv2 * 10 + worldEnv3 * 1);
};


`;
