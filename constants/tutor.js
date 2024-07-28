const COMMISSION_DATA = [
    {
        min: 0,
        max: 60,
        time: "00-60 Hr",
        percent: 24,
    },
    {
        min: 61,
        max: 120,
        time: "61-120 Hr",

        percent: 22,
    },
    {
        min: 121,
        max: 180,
        time: "121-180 Hr",

        percent: 20,
    },
    {
        min: 181,
        max: 240,
        time: "181-240 Hr",

        percent: 18,
    },
    {
        min: 241,
        max: 300,
        time: "241-300 Hr",
        percent: 16,
    },
    {
        min: 301,
        time: '301 > Hr',
        percent: 14
    },
    // {
    //     time: 'Demo Lesson',
    //     percent: '50%',
    // }
]

module.exports = COMMISSION_DATA
