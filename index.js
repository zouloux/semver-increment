/**
 * Increment any package.json version following semver.
 *
 * Use from an other node script :
 * const {semverIncrement, incrementPackage, getPackageVersion} = require('./semver-increment')
 *
 * Use from CLI to increment package.json version :
 * node semver-increment {major|minor|patch}
 *
 * Semver notation Major.Minor.Patch :
 * Major is X.0.0
 * Minor is 0.X.0
 * Patch is 0.0.X
 * 
 * Semver Index :
 * 0 for major
 * 1 for minor
 * 2 for patch
 */

const path = require('path');
const fs = require('fs');

module.exports = {

	/**
	 * Increment a version which is as a string.
	 */
	semverIncrement: function (version, semverIndex)
	{
		const splittedVersion = version.split('.');
		splittedVersion[ semverIndex ] = parseInt(splittedVersion[ semverIndex ], 10) + 1;
		return splittedVersion.join('.');
	},

	/**
	 * Increment any package.json version.
	 */
	incrementPackage: function (packagePath, semverIndex)
	{
		// Check if package file exists
		if ( !fs.existsSync(packagePath) )
		{
			throw new Error(`Package file ${packagePath} is not found.`, 1);
		}

		// Read package file content
		const packageData = JSON.parse( fs.readFileSync( packagePath ) );

		// Increment version according to semver increment index
		packageData.version = module.exports.semverIncrement(packageData.version, semverIndex);

		// Write new package.json
		fs.writeFileSync(packagePath, JSON.stringify( packageData, null, 2));

		// Return incremented version
		return packageData.version;
	},

	/**
	 * Get any package.json version
	 */
	getPackageVersion: function (packagePath)
	{
		return JSON.parse( fs.readFileSync( packagePath ) ).version;
	}
}

/**
 * Expose shell function
 */
processify({
	0: 'patch',
	1: 'package.json'
}, function (args)
{
	// Get increment name
	const incrementName = args[0].toLowerCase();
	const validIncrementNames = [
		'major',
		'minor',
		'patch'
	];

	// Get increment index and check its validity
	const incrementIndex = validIncrementNames.indexOf( incrementName );
	if (incrementIndex === -1)
	{
		error(`Invalid increment argument. Valid values :\n-> ${validIncrementNames.join(' / ')}\n\nex: npm run increment patch`);
	}

	// Increment package.json
	module.exports.incrementPackage(args[1], incrementIndex);
});
