import Image from "next/image";
import { Inter } from "next/font/google";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { ReactHTML, useState } from "react";
import { generateCallData, generateProofOfAge } from "@/utils/generateProof";
import { useContractWrite, usePrepareContractWrite } from "wagmi";
import Verifier from "../../public/Verifier.json";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const [age, setAge] = useState("");
  const [proofGenerated, setProofGenerated] = useState(false);
  const [proof, setProof] = useState<any>(null); // [proof, setProof
  const [publicSignals, setPublicSignals] = useState<any>(null); // [publicSignals, setPublicSignals
  const [state, setState] = useState(false);
  const [state2, setState2] = useState(false);
  const [callData, setCallData] = useState<any[]>([]); // [callData, setCallData

  const { config } = usePrepareContractWrite({
    address: "0x3BeA33A96Ad10aD3c28654623887Af21b2eb5E0c",
    abi: Verifier,
    functionName: "verifyProof",
    args: [callData[0], callData[1], callData[2], callData[3]],
  });

  const { data, isLoading, isSuccess, write } = useContractWrite(config);

  const handleAgeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAge(event.target.value);
  };

  const handleGenerateProof = async () => {
    setProofGenerated(true);
    const result = await generateProofOfAge(Number(age));
    console.log(result);
    setProof(result.proof);
    setPublicSignals(result.publicSignals);
    setState(result.res);
  };

  const handleCallData = async () => {
    console.log(state);
    const result = await generateCallData(proof, publicSignals);
    console.log(result);
    setCallData(result);
    setState2(true);
  };

  const handleVerify = () => {
    if (write) write();
  };
  return (
    <div className="p-12 bg-gray-100 h-screen">
      <ConnectButton />

      <h1 className="text-3xl font-bold mb-6 text-blue-600">Proof of Age</h1>

      {!proofGenerated ? (
        <div className="mb-4">
          <label className="block text-lg font-medium text-gray-700 mb-2">
            Enter your age:
            <input
              type="number"
              value={age}
              onChange={handleAgeChange}
              min="0"
              className="mt-2 p-2 w-full border-2 rounded-md shadow-sm"
            />
          </label>
          <button
            onClick={handleGenerateProof}
            className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:border-blue-800 focus:ring focus:ring-blue-200"
          >
            Generate Proof
          </button>
        </div>
      ) : (
        <div className="mb-4 text-green-600 font-semibold">
          Your proof of age has been generated!
        </div>
      )}

      {state && (
        <div className="mb-4">
          <button
            onClick={handleCallData}
            className="bg-yellow-600 text-white px-6 py-2 rounded-md hover:bg-yellow-700 focus:outline-none focus:border-yellow-800 focus:ring focus:ring-yellow-200"
          >
            Generate Call Data
          </button>
        </div>
      )}

      {state2 && (
        <div className="mb-4">
          <button
            onClick={handleVerify}
            className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 focus:outline-none focus:border-green-800 focus:ring focus:ring-green-200"
          >
            Verify On Chain
          </button>
        </div>
      )}

      {isSuccess && (
        <div className="mb-4 p-4 border rounded-md bg-green-50 text-green-700">
          <p className="font-medium">Transaction Hash:</p>
          <p className="mt-2">{data?.hash}</p>
        </div>
      )}
    </div>
  );
}
