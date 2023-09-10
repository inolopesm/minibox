import NextHead from "next/head";
import NextLink from "next/link";
import knex from "knex";
import ArrowLeftIcon from "@heroicons/react/24/outline/ArrowLeftIcon";
import PlusIcon from "@heroicons/react/24/outline/PlusIcon";
import { Button } from "../../components/Button";
import { Link } from "../../components/Link";
import { TextField } from "../../components/TextField";
import { useEffect, useState } from "react";
import { HttpClient } from "../../utils/HttpClient";
import { Alert } from "../../components/Alert";
import { useDebounce } from "../../hooks/useDebounce";
import { GetServerSidePropsAdapter } from "../../utils/GetServerSidePropsAdapter";
import { withKnex } from "../../decorators/withKnex";
import { onlyAuthenticated } from "../../decorators/onlyAuthenticated";

async function getPeoplePageProps(context) {}

export const getServerSideProps = GetServerSidePropsAdapter
  .adapt(withKnex(onlyAuthenticated(getPeoplePageProps, "/signin")));
