import { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import IREditor from '@/components/IREditor';
import CFGViewer from '@/components/CFGViewer';
import { parseLLVMIR } from '@/lib/parser';
import { generateCFG } from '@/lib/cfg';

export default function Home() {
  const [irCode, setIRCode] = useState<string>('');
  const [cfgData, setCfgData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  // サンプルIRコード
  const sampleIR = `define i32 @factorial(i32 %n) {
entry:
  %cmp = icmp slt i32 %n, 1
  br i1 %cmp, label %return, label %recurse

recurse:
  %sub = sub i32 %n, 1
  %call = call i32 @factorial(i32 %sub)
  %mul = mul i32 %n, %call
  br label %return

return:
  %result = phi i32 [ 1, %entry ], [ %mul, %recurse ]
  ret i32 %result
}`;

  useEffect(() => {
    if (!irCode) {
      setIRCode(sampleIR);
      return;
    }

    try {
      const parsedIR = parseLLVMIR(irCode);
      const cfg = generateCFG(parsedIR);
      setCfgData(cfg);
      setError(null);
    } catch (err) {
      console.error('Error parsing IR or generating CFG:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
      setCfgData(null);
    }
  }, [irCode]);

  const handleIRChange = (newIRCode: string) => {
    setIRCode(newIRCode);
  };

  return (
    <Layout>
      <div className="flex flex-col md:flex-row h-full">
        <div className="w-full md:w-1/2 p-4">
          <h2 className="text-xl font-bold mb-2">LLVM IR</h2>
          <IREditor code={irCode} onChange={handleIRChange} />
        </div>
        <div className="w-full md:w-1/2 p-4">
          <h2 className="text-xl font-bold mb-2">Control Flow Graph</h2>
          {error ? (
            <div className="text-red-500 p-4 border border-red-300 rounded bg-red-50">
              {error}
            </div>
          ) : (
            <CFGViewer data={cfgData} />
          )}
        </div>
      </div>
    </Layout>
  );
}
