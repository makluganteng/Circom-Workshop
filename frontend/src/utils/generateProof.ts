const mainCircuit = () => {
  const wasmFile_m = "./proof_of_age.wasm";
  const zkeyFile_m = "./proof_of_age.zkey";
  const verificationKey_m = "./vkey.json";

  return { wasmFile_m, zkeyFile_m, verificationKey_m };
};

export async function generateProofOfAge(age: number) {
  const { wasmFile_m, zkeyFile_m, verificationKey_m } = mainCircuit();
  const { proof, publicSignals } = await generateProof(
    { age: age, ageLimit: 18 },
    wasmFile_m,
    zkeyFile_m
  );
  console.log(proof, publicSignals);
  const res = await verifyProof(verificationKey_m, publicSignals, proof);
  console.log(res);
  return {
    proof,
    publicSignals,
    res,
  };
}

export const generateProof = async (
  _proofInput: any,
  _wasm: string,
  _zkey: string
) => {
  debugger;
  console.log(_proofInput, _wasm, _zkey, window.snarkjs);
  console.log("generateProof");
  const { proof, publicSignals } = await window.snarkjs.groth16.fullProve(
    _proofInput,
    _wasm,
    _zkey
  );
  return { proof, publicSignals };
};

const verifyProof = async (
  _verificationkey: string,
  signals: string,
  proof: string
) => {
  const vkey = await fetch(_verificationkey).then(function (res) {
    return res.json();
  });

  const res = await window.snarkjs.groth16.verify(vkey, signals, proof);
  return res;
};

export const generateCallData = async (proof: any, publicSignals: any) => {
  const callData = await window.snarkjs.groth16.exportSolidityCallData(
    proof,
    publicSignals
  );
  const result = parseArrayString(callData);
  return result;
};

export function parseArrayString(arrayString: string) {
  // Add brackets at the start and end to create a top-level array
  const modifiedString = "[" + arrayString + "]";

  // Replace single quotes with double quotes
  const jsonString = modifiedString.replace(/'/g, '"');

  // Parse the JSON string into an array
  const array = JSON.parse(jsonString);

  return array;
}
