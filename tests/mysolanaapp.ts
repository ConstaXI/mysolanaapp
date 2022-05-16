import * as anchor from "@project-serum/anchor";
import { Program } from "@project-serum/anchor";
import { assert } from "chai";
import { Mysolanaapp } from "../target/types/mysolanaapp";
const { SystemProgram } = anchor.web3;

describe("mysolanaapp", () => {
  const provider = anchor.AnchorProvider.local();

  anchor.setProvider(provider);

  const program = anchor.workspace.Mysolanaapp as Program<Mysolanaapp>;

  let baseAccount: anchor.web3.Keypair;
  before(async () => {
    baseAccount = anchor.web3.Keypair.generate()
  })

  it("Creates a counter)", async () => {
    /* Call the create function via RPC */
    await program.rpc.create({
      accounts: {
        baseAccount: baseAccount.publicKey,
        user: provider.wallet.publicKey,
        systemProgram: SystemProgram.programId,
      },
      signers: [baseAccount],
    });

    /* Fetch the account and check the value of count */
    const account = await program.account.baseAccount.fetch(baseAccount.publicKey);
    console.log('Count 0: ', account.count.toString())
    assert.ok(account.count.toString() === "0");
  });

  it("Increments the counter", async () => {
    await program.rpc.increment({
      accounts: {
        baseAccount: baseAccount.publicKey,
      },
    });

    const account = await program.account.baseAccount.fetch(baseAccount.publicKey);
    console.log('Count 1: ', account.count.toString())
    assert.ok(account.count.toString() === "1");
  });
});
