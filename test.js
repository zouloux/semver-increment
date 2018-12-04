const {semverIncrement} = require('./index');

const test = function (name, action, value)
{
	process.stdout.write(`${name} ...`);

	const result = action();

	if (value != result)
	{
		console.log('');
		console.error(`-> Failed`, result, value);
		process.exit(1);
	}
	process.stdout.write(' ✔\n');
}

test( `Increment major simple`, () => semverIncrement('0.0.0', 0), '1.0.0' );
test( `Increment minor simple`, () => semverIncrement('0.0.0', 1), '0.1.0' );
test( `Increment patch simple`, () => semverIncrement('0.0.0', 2), '0.0.1' );

test( `Increment major reset`, () => semverIncrement('0.1.12', 0), '1.0.0' );
test( `Increment minor reset`, () => semverIncrement('0.1.12', 1), '0.2.0' );
test( `Increment patch reset`, () => semverIncrement('0.1.12', 2), '0.1.13' );