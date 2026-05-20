import { Link } from "expo-router";
import { Text, View } from "react-native";

const SignUp = () => {
  return (
    <View>
      <Text>SignUp</Text>
      <Link href="/(auth)/sign-in" className="mt-4 text-blue-500">
        Already have an account? Sign In
      </Link>
    </View>
  );
};

export default SignUp;
