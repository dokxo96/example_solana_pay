import * as anchor from "@project-serum/anchor";
import { Program } from "@project-serum/anchor";
import { ExampleSolanaPay } from "../target/types/example_solana_pay";

describe("example-solana-pay", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace.ExampleSolanaPay as Program<ExampleSolanaPay>;

  it("Is initialized!", async () => {
    // Add your test here.
    const tx = await program.methods.initialize().rpc();
    console.log("Your transaction signature", tx);
  });
});
