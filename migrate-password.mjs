import pg from 'pg';
import bcrypt from 'bcryptjs';

const client =  new pg.Client({
    host: "localhost",
    user: "postgres",
    port: 5432,
    password: "postgres",
    database: "berita"
});

await client.connect();

try {
    const { rows } = await client.query('SELECT id, password FROM data_wartawan');
    for (const row  of rows) {
        const plain  = row.password;

        if (plain.startsWith('$2')) continue;
        const hash = await bcrypt.hash(plain, 10);
        await client.query(
            'UPDATE data_wartawan SET password=$1 WHERE id=$2', [hash, row.id]
        );
        console.log('User id=${row.id} password di hash');
    }
    console.log('Selesai meng-hash semua password');
} catch (err) {
    console.error('Error:', err);
} finally {
    await client.end();
}


