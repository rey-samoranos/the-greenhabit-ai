import { supabase } from './supabase';
import { useEffect, useState } from 'react';

export default function TestDatabase() {
  const [status, setStatus] = useState('Testing...');
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    async function testConnection() {
      try {
        // Test 1: Check if we can connect
        const { data: testData, error: testError } = await supabase
          .from('habit_plans')
          .select('count');
        
        if (testError) throw testError;
        setStatus('✅ Connected to Supabase!');
        
        // Test 2: Try to fetch data
        const { data: plans, error: plansError } = await supabase
          .from('habit_plans')
          .select('*')
          .limit(5);
        
        if (plansError) throw plansError;
        setData(plans || []);
        
      } catch (err: any) {
        setStatus(`❌ Error: ${err.message}`);
        console.error(err);
      }
    }
    
    testConnection();
  }, []);

  return (
    <div className="p-8 bg-[#041736] min-h-screen text-white">
      <h1 className="text-2xl font-bold mb-4">Database Test</h1>
      <div className="bg-green-900/30 p-4 rounded-lg mb-4">
        <p className="font-mono">{status}</p>
      </div>
      <div>
        <p className="mb-2">Found {data.length} records in habit_plans table</p>
        <pre className="bg-black/30 p-4 rounded-lg text-sm overflow-auto">
          {JSON.stringify(data, null, 2)}
        </pre>
      </div>
    </div>
  );
}