import { NextResponse } from "next/server";
import { supabase } from "../../../lib/supabase";

/* ── In-memory cache (5 min TTL) ── */
let cache = null;
let cacheTimestamp = 0;
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes in ms
const MIN_RECORDS = 50;

export async function GET() {
  // Return cached data if fresh
  const now = Date.now();
  if (cache && now - cacheTimestamp < CACHE_TTL) {
    return NextResponse.json(cache);
  }

  try {
    // Step 1: Check record count first (cheap query)
    const countRes = await supabase
      .from("prompt_metrics")
      .select("*", { count: "exact", head: true });

    const totalOptimizations = countRes.count ?? 0;

    // Below threshold — skip expensive RPCs, cache the "hidden" response
    if (totalOptimizations < MIN_RECORDS) {
      const hidden = { showStats: false };
      cache = hidden;
      cacheTimestamp = now;
      return NextResponse.json(hidden);
    }

    // Step 2: Enough records — run aggregate RPCs in parallel
    const [avgRes, savedRes, modelRes] = await Promise.all([
      supabase.rpc("avg_reduction"),
      supabase.rpc("total_tokens_saved"),
      supabase.rpc("most_used_model"),
    ]);

    const stats = {
      showStats: true,
      totalOptimizations,
      avgReduction: Math.round(avgRes.data ?? 0),
      totalTokensSaved: savedRes.data ?? 0,
      mostUsedModel: modelRes.data ?? "—",
    };

    // Update cache
    cache = stats;
    cacheTimestamp = now;

    return NextResponse.json(stats);
  } catch (err) {
    console.error("Stats error:", err);

    // Return stale cache if available, otherwise hidden
    if (cache) return NextResponse.json(cache);

    return NextResponse.json({ showStats: false }, { status: 500 });
  }
}
