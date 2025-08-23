import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";

const InfoDisplayCard = () => {
  return (
    <Card className="w-60 overflow-hidden border border-gray-700">
      <CardHeader className="-mt-6 bg-black pt-4 pb-2 ">
        <CardTitle className="text-primary">Card Title</CardTitle>
      </CardHeader>
      <CardContent>Content</CardContent>
      <CardFooter>Footer</CardFooter>
    </Card>
  );
};

export default InfoDisplayCard;
