// The states Clairo serves and their counties, in the order the /contact form lists them.
// ONE source of truth: contact.astro renders the state options from STATES and inlines COUNTIES as
// window.CLAIRO_COUNTIES for public/interest-form.js, and api/interest.js validates against the same
// lists. Spellings follow Logan's list (Baltimore County and Baltimore City are separate entries).

export const STATES = [
  { code: 'MD', label: 'Maryland' },
  { code: 'PA', label: 'Pennsylvania' },
];

export const COUNTIES = {
  MD: [
    'Allegany', 'Anne Arundel', 'Baltimore County', 'Baltimore City', 'Calvert', 'Caroline',
    'Carroll', 'Cecil', 'Charles', 'Dorchester', 'Frederick', 'Garrett', 'Harford', 'Howard',
    'Kent', 'Montgomery', "Prince George's", "Queen Anne's", "St. Mary's", 'Somerset', 'Talbot',
    'Washington', 'Wicomico', 'Worcester',
  ],
  PA: [
    'Adams', 'Allegheny', 'Armstrong', 'Beaver', 'Bedford', 'Berks', 'Blair', 'Bradford', 'Bucks',
    'Butler', 'Cambria', 'Cameron', 'Carbon', 'Centre', 'Chester', 'Clarion', 'Clearfield',
    'Clinton', 'Columbia', 'Crawford', 'Cumberland', 'Dauphin', 'Delaware', 'Elk', 'Erie',
    'Fayette', 'Forest', 'Franklin', 'Fulton', 'Greene', 'Huntingdon', 'Indiana', 'Jefferson',
    'Juniata', 'Lackawanna', 'Lancaster', 'Lawrence', 'Lebanon', 'Lehigh', 'Luzerne', 'Lycoming',
    'McKean', 'Mercer', 'Mifflin', 'Monroe', 'Montgomery', 'Montour', 'Northampton',
    'Northumberland', 'Perry', 'Philadelphia', 'Pike', 'Potter', 'Schuylkill', 'Snyder',
    'Somerset', 'Sullivan', 'Susquehanna', 'Tioga', 'Union', 'Venango', 'Warren', 'Washington',
    'Wayne', 'Westmoreland', 'Wyoming', 'York',
  ],
};
