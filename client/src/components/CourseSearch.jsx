import Autocomplete from "@mui/material/Autocomplete";
import Typography from "@mui/material/Typography";
import * as React from "react";
// For the sake of this demo, we have to use debounce to reduce Google Maps Places API quote use
// But prefer to use throttle in practice
// import throttle from 'lodash/throttle';
import { TextField } from "@mui/material";
import { debounce } from "@mui/material/utils";
import api from "../utils/api";

const useEnhancedEffect = typeof window !== "undefined" ? React.useLayoutEffect : React.useEffect;

const fetch = debounce(async (request, callback) => {
    try {
        const res = await api.get(`/api/course/user?search=${request.input}`);

        callback(res);
    } catch (err) {
        if (err.message === "Quota exceeded for quota") {
            callback({});
        }

        throw err;
    }
}, 400);

const emptyOptions = [];

function CourseSearch({ onChange }) {
    const [value, setValue] = React.useState(null);
    const [inputValue, setInputValue] = React.useState("");
    const [options, setOptions] = React.useState(emptyOptions);

    useEnhancedEffect(() => {
        // Allow to resolve the out of order request resolution.
        let active = true;

        fetch({ input: inputValue }, (results) => {
            if (!active) {
                return;
            }

            let newOptions = [];

            if (results) {
                newOptions = results;

                if (value) {
                    newOptions = [value, ...results.filter(({ result }) => result !== value)];
                }
            } else if (value) {
                newOptions = [value];
            }
            console.log({ newOptions });
            setOptions(newOptions);
        });

        return () => {
            active = false;
        };
    }, [value, inputValue]);

    console.log({ options });
    return (
        <Autocomplete
            sx={{ width: 300 }}
            getOptionLabel={(option) => option}
            filterOptions={(x) => x}
            options={options}
            autoComplete
            includeInputInList
            filterSelectedOptions
            value={value}
            noOptionsText=""
            freeSolo
            onChange={(event, newValue) => {
                console.log("onchange");
                setOptions(newValue ? [newValue, ...options] : options);
                setValue(newValue);
                onChange(newValue);
            }}
            onBlur={() => onChange(inputValue)}
            onInputChange={(event, newInputValue) => {
                setInputValue(newInputValue);
            }}
            renderInput={(params) => (
                <TextField
                    {...params}
                    variant="outlined"
                    fullWidth
                    slotProps={{
                        ...params.InputProps,
                    }}
                />
            )}
            renderOption={(props, option) => {
                return (
                    <li {...props}>
                        <Typography variant="body1">{option}</Typography>
                    </li>
                );
            }}
        />
    );
}

export default CourseSearch;
