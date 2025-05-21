export const DEFAULT_ERRORS = [
    {
        error: "required",
        format: label => `${label} is required`
    },
    {
        error: "pattern",
        format: label => `${label} is invalid`
    },
    {
        error: "minlength",
        format: (label, error) => `${label} must be at least ${error.requiredLength} characters`
    },
    {
        error: "maxlength",
        format: (label, error) => `${label} must be no longer than ${error.requiredLength} characters`
    },
    {
        error: "requiredTrue",
        format: (label, error) => `${label} is required`
    },
    {
        error: "email",
        format: (label, error) => `Invalid email address`
    },
    {
        error: "max",
        format: (label, error) => `${label} must be no greater than ${error.max}`
    },
    {
        error: "min",
        format: (label, error) => `${label} must be no less than ${error.min}`
    }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGVmYXVsdC1lcnJvcnMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9wcm9qZWN0cy9uZy1ib290c3RyYXAtZm9ybS12YWxpZGF0aW9uL3NyYy9saWIvZGVmYXVsdC1lcnJvcnMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBRUEsTUFBTSxDQUFDLE1BQU0sY0FBYyxHQUFtQjtJQUM1QztRQUNFLEtBQUssRUFBRSxVQUFVO1FBQ2pCLE1BQU0sRUFBRSxLQUFLLENBQUMsRUFBRSxDQUFDLEdBQUcsS0FBSyxjQUFjO0tBQ3hDO0lBQ0Q7UUFDRSxLQUFLLEVBQUUsU0FBUztRQUNoQixNQUFNLEVBQUUsS0FBSyxDQUFDLEVBQUUsQ0FBQyxHQUFHLEtBQUssYUFBYTtLQUN2QztJQUNEO1FBQ0UsS0FBSyxFQUFFLFdBQVc7UUFDbEIsTUFBTSxFQUFFLENBQUMsS0FBSyxFQUFFLEtBQUssRUFBRSxFQUFFLENBQ3ZCLEdBQUcsS0FBSyxxQkFBcUIsS0FBSyxDQUFDLGNBQWMsYUFBYTtLQUNqRTtJQUNEO1FBQ0UsS0FBSyxFQUFFLFdBQVc7UUFDbEIsTUFBTSxFQUFFLENBQUMsS0FBSyxFQUFFLEtBQUssRUFBRSxFQUFFLENBQ3ZCLEdBQUcsS0FBSywyQkFBMkIsS0FBSyxDQUFDLGNBQWMsYUFBYTtLQUN2RTtJQUNEO1FBQ0UsS0FBSyxFQUFFLGNBQWM7UUFDckIsTUFBTSxFQUFFLENBQUMsS0FBSyxFQUFFLEtBQUssRUFBRSxFQUFFLENBQUMsR0FBRyxLQUFLLGNBQWM7S0FDakQ7SUFDRDtRQUNFLEtBQUssRUFBRSxPQUFPO1FBQ2QsTUFBTSxFQUFFLENBQUMsS0FBSyxFQUFFLEtBQUssRUFBRSxFQUFFLENBQUMsdUJBQXVCO0tBQ2xEO0lBQ0Q7UUFDRSxLQUFLLEVBQUUsS0FBSztRQUNaLE1BQU0sRUFBRSxDQUFDLEtBQUssRUFBRSxLQUFLLEVBQUUsRUFBRSxDQUFDLEdBQUcsS0FBSyw0QkFBNEIsS0FBSyxDQUFDLEdBQUcsRUFBRTtLQUMxRTtJQUNEO1FBQ0UsS0FBSyxFQUFFLEtBQUs7UUFDWixNQUFNLEVBQUUsQ0FBQyxLQUFLLEVBQUUsS0FBSyxFQUFFLEVBQUUsQ0FBQyxHQUFHLEtBQUsseUJBQXlCLEtBQUssQ0FBQyxHQUFHLEVBQUU7S0FDdkU7Q0FDRixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgRXJyb3JNZXNzYWdlIH0gZnJvbSBcIi4vTW9kZWxzL2Vycm9yLW1lc3NhZ2VcIjtcblxuZXhwb3J0IGNvbnN0IERFRkFVTFRfRVJST1JTOiBFcnJvck1lc3NhZ2VbXSA9IFtcbiAge1xuICAgIGVycm9yOiBcInJlcXVpcmVkXCIsXG4gICAgZm9ybWF0OiBsYWJlbCA9PiBgJHtsYWJlbH0gaXMgcmVxdWlyZWRgXG4gIH0sXG4gIHtcbiAgICBlcnJvcjogXCJwYXR0ZXJuXCIsXG4gICAgZm9ybWF0OiBsYWJlbCA9PiBgJHtsYWJlbH0gaXMgaW52YWxpZGBcbiAgfSxcbiAge1xuICAgIGVycm9yOiBcIm1pbmxlbmd0aFwiLFxuICAgIGZvcm1hdDogKGxhYmVsLCBlcnJvcikgPT5cbiAgICAgIGAke2xhYmVsfSBtdXN0IGJlIGF0IGxlYXN0ICR7ZXJyb3IucmVxdWlyZWRMZW5ndGh9IGNoYXJhY3RlcnNgXG4gIH0sXG4gIHtcbiAgICBlcnJvcjogXCJtYXhsZW5ndGhcIixcbiAgICBmb3JtYXQ6IChsYWJlbCwgZXJyb3IpID0+XG4gICAgICBgJHtsYWJlbH0gbXVzdCBiZSBubyBsb25nZXIgdGhhbiAke2Vycm9yLnJlcXVpcmVkTGVuZ3RofSBjaGFyYWN0ZXJzYFxuICB9LFxuICB7XG4gICAgZXJyb3I6IFwicmVxdWlyZWRUcnVlXCIsXG4gICAgZm9ybWF0OiAobGFiZWwsIGVycm9yKSA9PiBgJHtsYWJlbH0gaXMgcmVxdWlyZWRgXG4gIH0sXG4gIHtcbiAgICBlcnJvcjogXCJlbWFpbFwiLFxuICAgIGZvcm1hdDogKGxhYmVsLCBlcnJvcikgPT4gYEludmFsaWQgZW1haWwgYWRkcmVzc2BcbiAgfSxcbiAge1xuICAgIGVycm9yOiBcIm1heFwiLFxuICAgIGZvcm1hdDogKGxhYmVsLCBlcnJvcikgPT4gYCR7bGFiZWx9IG11c3QgYmUgbm8gZ3JlYXRlciB0aGFuICR7ZXJyb3IubWF4fWBcbiAgfSxcbiAge1xuICAgIGVycm9yOiBcIm1pblwiLFxuICAgIGZvcm1hdDogKGxhYmVsLCBlcnJvcikgPT4gYCR7bGFiZWx9IG11c3QgYmUgbm8gbGVzcyB0aGFuICR7ZXJyb3IubWlufWBcbiAgfVxuXTtcbiJdfQ==